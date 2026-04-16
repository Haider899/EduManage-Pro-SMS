import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User, { UserRole } from '../models/User';
import Teacher from '../models/Teacher';
import HR from '../models/HR';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';
import { config } from '../utils/config';
import { sendEmail } from '../utils/email';
import { IS_MOCK_MODE } from '../index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const signToken = (id: string) => {
  return jwt.sign({ id }, config.jwtSecret as jwt.Secret, {
    expiresIn: config.jwtExpire as jwt.SignOptions['expiresIn'],
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

export const register = asyncHandler(async (req: any, res: Response) => {
  const { role } = req.body;
  const currentUser = req.user;

  if (!currentUser) {
    if (role && role !== UserRole.STUDENT) {
      throw new AppError('Public registration is restricted to students only.', 403);
    }
  }

  if (currentUser && currentUser.role === UserRole.HR) {
    if (role && role !== UserRole.STUDENT) {
      throw new AppError('HR can only onboard students.', 403);
    }
  }

  if (
    currentUser &&
    ![UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR].includes(currentUser.role) &&
    role &&
    role !== UserRole.STUDENT
  ) {
    throw new AppError('You do not have permission to register privileged accounts.', 403);
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: role || UserRole.STUDENT,
  });

  createSendToken(newUser, 201, res);
});

export const onboardStaff = asyncHandler(async (req: any, res: Response) => {
  const { name, username, email, password, role, phone, address, city, state, pinCode, joiningDate, employeeId } = req.body;

  if (!name || !username || !password || !role) {
    throw new AppError('Missing required fields for staff onboarding', 400);
  }

  if (![UserRole.SUPERADMIN, UserRole.ADMIN].includes(req.user.role)) {
    throw new AppError('Unauthorized: Only super administrators and administrators can onboard staff identities', 403);
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, ...(email ? [{ email: email.toLowerCase() }] : [])],
  });

  if (existingUser) {
    if (!existingUser.refId) {
      console.log(`[ONBOARD] Cleaning up orphaned user record for: ${existingUser.username}`);
      await User.findByIdAndDelete(existingUser._id);
    } else {
      throw new AppError(
        `A staff member with username '${username}' already exists and has an active profile. Use a different username.`,
        400
      );
    }
  }

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Staff';

  let newUser;
  try {
    newUser = await User.create({
      name,
      username,
      email: email || undefined,
      password,
      role,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      throw new AppError('Username or email already exists. Please use different credentials.', 400);
    }
    throw err;
  }

  let profile;
  const commonData = {
    employeeId: employeeId || `STAFF-${Date.now().toString().slice(-6)}`,
    firstName,
    lastName,
    email: email || `${username}@school.com`,
    phone: phone || '000-000-0000',
    address: address || 'Main Campus',
    city: city || '',
    state: state || '',
    pinCode: pinCode || '',
    joiningDate: joiningDate || new Date(),
  };

  try {
    if (role === UserRole.HR) {
      profile = await HR.create(commonData);
    } else if (role === UserRole.TEACHER) {
      profile = await Teacher.create({
        ...commonData,
        dateOfBirth: req.body.dateOfBirth || new Date('1990-01-01'),
        gender: req.body.gender || 'other',
        qualification: req.body.qualification || 'Not Specified',
        experience: req.body.experience || 0,
        salary: req.body.salary || 0,
      });
    } else {
      throw new AppError('Only HR and teacher identities can be onboarded here.', 400);
    }
  } catch (profileError: any) {
    console.error(`[ONBOARD] Profile creation failed for ${username}. Rolling back User record.`, profileError.message);
    await User.findByIdAndDelete(newUser._id);
    throw new AppError(`Failed to create ${role} profile: ${profileError.message}. The operation has been rolled back.`, 400);
  }

  if (profile) {
    newUser.refId = String(profile._id) as any;
    await newUser.save({ validateBeforeSave: false });
  }

  res.status(201).json({
    success: true,
    data: {
      user: {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
        refId: newUser.refId,
      },
      profile,
    },
    message: `Successfully onboarded ${String(role).toUpperCase()} identity: ${name} with full professional profile.`,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  console.log(`[AUTH] Login attempt for identifier: ${identifier}`);

  if (IS_MOCK_MODE) {
    console.log('[AUTH] System is in MOCK MODE. Using local JSON data.');
    const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/mockDB.json'), 'utf8'));
    const user = mockData.users.find(
      (u: any) =>
        (u.email === identifier.toLowerCase() || u.username === identifier.toLowerCase()) &&
        u.password === password
    );

    if (user) {
      console.log(`[AUTH] Mock login successful for: ${user.username}`);
      createSendToken({ ...user, _id: 'mock-id-' + user.username }, 200, res);
      return;
    }

    console.warn(`[AUTH] Mock login failed for ${identifier}`);
    throw new AppError('Incorrect credentials (Mock Mode)', 401);
  }

  if (!identifier || !password) {
    throw new AppError('Please provide identifier (email/username) and password', 400);
  }

  const searchIdentifier = identifier.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: searchIdentifier }, { username: searchIdentifier }],
  }).select('+password');

  if (!user) {
    console.warn(`[AUTH] Login failed: No user found for ${searchIdentifier}`);
    throw new AppError('Incorrect credentials', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    console.warn(`[AUTH] Login failed: Password mismatch for ${searchIdentifier}`);
    throw new AppError('Incorrect credentials', 401);
  }

  console.log(`[AUTH] Login successful for: ${user.username} (${user.role})`);
  createSendToken(user, 200, res);
});

export const getMe = asyncHandler(async (req: any, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body;

  const searchIdentifier = identifier ? identifier.toLowerCase() : '';
  const user = await User.findOne({
    $or: [{ email: searchIdentifier }, { username: searchIdentifier }],
  });

  if (!user) {
    console.warn(`[AUTH] Forgot password requested for unknown identifier: ${searchIdentifier}`);
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that identifier, a reset link has been sent.',
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const originHeader = req.get('origin');
  const firstCors = (config.corsOrigin || '').split(',')[0].trim();
  const baseUrl = originHeader || config.frontendUrl || firstCors;
  const resetURL = `${baseUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;
  const message = `Forgot your password? Click the link to reset it: ${resetURL}\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email || 'admin@school.com',
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    const responsePayload: any = { success: true, message: 'Token sent to email!' };
    if (config.nodeEnv !== 'production') responsePayload.resetURL = resetURL;

    return res.status(200).json(responsePayload);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const updateMe = asyncHandler(async (req: any, res: Response) => {
  const { name, email } = req.body;

  if (IS_MOCK_MODE) {
    const mockPath = path.join(__dirname, '../data/mockDB.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
    const userIdx = mockData.users.findIndex((u: any) => u.username === req.user.username);

    if (userIdx !== -1) {
      if (name) mockData.users[userIdx].name = name;
      if (email) mockData.users[userIdx].email = email;
      fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2));
      return res.status(200).json({
        success: true,
        data: { user: mockData.users[userIdx] },
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true });

  return res.status(200).json({
    success: true,
    data: { user: updatedUser },
  });
});

export const updatePassword = asyncHandler(async (req: any, res: Response) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    throw new AppError('Passwords do not match', 400);
  }

  if (IS_MOCK_MODE) {
    const mockPath = path.join(__dirname, '../data/mockDB.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
    const userIdx = mockData.users.findIndex((u: any) => u.username === req.user.username);

    if (userIdx !== -1) {
      if (mockData.users[userIdx].password !== passwordCurrent) {
        throw new AppError('Your current password is wrong', 401);
      }

      mockData.users[userIdx].password = password;
      fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2));

      const user = mockData.users[userIdx];
      createSendToken({ ...user, _id: 'mock-id-' + user.username }, 200, res);
      return;
    }
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!(await user.comparePassword(passwordCurrent))) {
    throw new AppError('Your current password is wrong', 401);
  }

  user.password = password;
  await user.save();

  createSendToken(user, 200, res);
});
