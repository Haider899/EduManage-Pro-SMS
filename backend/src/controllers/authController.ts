import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User';
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
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // Remove password from output
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

  // 1) Logic for public (unauthenticated) registration
  if (!currentUser) {
    if (role && role !== 'student') {
      throw new AppError('Public registration is restricted to students only.', 403);
    }
  }

  // 2) Logic for Admin-initiated onboarding
  if (currentUser && currentUser.role === 'admin') {
    // Admin can create any role (including HR and Teacher)
  }

  // 3) Logic for HR-initiated onboarding
  if (currentUser && currentUser.role === 'hr') {
    if (role && role !== 'student') {
      throw new AppError('HR can only onboard students.', 403);
    }
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: role || 'student',
  });

  createSendToken(newUser, 201, res);
});

export const onboardStaff = asyncHandler(async (req: any, res: Response) => {
  const { name, username, email, password, role, phone, address, city, state, pinCode, joiningDate, employeeId } = req.body;

  // 1) Validation
  if (!name || !username || !password || !role) {
    throw new AppError('Missing required fields for staff onboarding', 400);
  }

  // 2) Security: Only Admins can onboard Staff (HR and Teachers)
  if (req.user.role !== 'admin') {
    throw new AppError('Unauthorized: Only administrators can onboard staff identities', 403);
  }

  // 3) Pre-check: Does a User with this username or email already exist?
  const existingUser = await User.findOne({
    $or: [
      { username: username.toLowerCase() },
      ...(email ? [{ email: email.toLowerCase() }] : [])
    ]
  });

  if (existingUser) {
    // Check if this is an orphan (User exists but no linked profile)
    if (!existingUser.refId) {
      // Clean up orphaned user from a previous failed attempt
      console.log(`[ONBOARD] Cleaning up orphaned user record for: ${existingUser.username}`);
      await User.findByIdAndDelete(existingUser._id);
    } else {
      throw new AppError(
        `A staff member with username '${username}' already exists and has an active profile. Use a different username.`,
        400
      );
    }
  }

  // 4) Split name for profile records
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Staff';

  // 5) Create Primary User Record
  let newUser;
  try {
    newUser = await User.create({
      name,
      username,
      email: email || undefined, // Don't save empty string, let sparse index work
      password,
      role,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      throw new AppError(`Username or email already exists. Please use different credentials.`, 400);
    }
    throw err;
  }

  // 6) Create Secondary Profile Record (Full Profile) — with ROLLBACK on failure
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
    if (role === 'hr') {
      profile = await HR.create(commonData);
    } else if (role === 'teacher') {
      profile = await Teacher.create({
        ...commonData,
        dateOfBirth: req.body.dateOfBirth || new Date('1990-01-01'),
        gender: req.body.gender || 'other',
        qualification: req.body.qualification || 'Not Specified',
        experience: req.body.experience || 0,
        salary: req.body.salary || 0,
      });
    }
  } catch (profileError: any) {
    // ROLLBACK: Delete the User record if profile creation fails
    console.error(`[ONBOARD] Profile creation failed for ${username}. Rolling back User record.`, profileError.message);
    await User.findByIdAndDelete(newUser._id);
    throw new AppError(
      `Failed to create ${role} profile: ${profileError.message}. The operation has been rolled back.`,
      400
    );
  }

  // 7) Link User to Profile
  if (profile) {
    newUser.refId = profile._id;
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
        refId: newUser.refId
      },
      profile
    },
    message: `Successfully onboarded ${role.toUpperCase()} identity: ${name} with full professional profile.`
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
      return createSendToken({ ...user, _id: 'mock-id-' + user.username }, 200, res);
    } else {
      console.warn(`[AUTH] Mock login failed for ${identifier}`);
      throw new AppError('Incorrect credentials (Mock Mode)', 401);
    }
  }

  // 1) Check if identifier and password exist
  if (!identifier || !password) {
    throw new AppError('Please provide identifier (email/username) and password', 400);
  }

  // 2) Check if user exists && password is correct
  const searchIdentifier = identifier.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: searchIdentifier }, { username: searchIdentifier }]
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

  // 3) If everything ok, send token to client
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

  // 1) Get user based on POSTed email or username
  const searchIdentifier = identifier ? identifier.toLowerCase() : '';
  const user = await User.findOne({
    $or: [{ email: searchIdentifier }, { username: searchIdentifier }]
  });

  if (!user) {
    // We send success even if user not found to prevent user enumeration, 
    // but in SMS context we can be more specific or log it.
    console.warn(`[AUTH] Forgot password requested for unknown identifier: ${searchIdentifier}`);
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that identifier, a reset link has been sent.',
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Build a reliable reset URL. Prefer the request Origin, then configured FRONTEND_URL, then the first CORS origin.
  const originHeader = req.get('origin');
  const firstCors = (config.corsOrigin || '').split(',')[0].trim();
  const baseUrl = originHeader || config.frontendUrl || firstCors;
  const resetURL = `${baseUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;
  const message = `Forgot your password? Click the link to reset it: ${resetURL}\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email || 'admin@school.com', // Fallback for seeding
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    // In development, include the reset URL in the response to make testing easier.
    const responsePayload: any = { success: true, message: 'Token sent to email!' };
    if (config.nodeEnv !== 'production') responsePayload.resetURL = resetURL;

    res.status(200).json(responsePayload);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Log the user in, send JWT
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
        data: { user: mockData.users[userIdx] }
      });
    }
  }

  // 1) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: { user: updatedUser }
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
      // Check current password
      if (mockData.users[userIdx].password !== passwordCurrent) {
        throw new AppError('Your current password is wrong', 401);
      }
      // Update password
      mockData.users[userIdx].password = password;
      fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2));
      
      const user = mockData.users[userIdx];
      return createSendToken({ ...user, _id: 'mock-id-' + user.username }, 200, res);
    }
  }

  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.comparePassword(passwordCurrent))) {
    throw new AppError('Your current password is wrong', 401);
  }

  // 3) If so, update password
  user.password = password;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
