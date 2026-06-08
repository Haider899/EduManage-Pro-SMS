import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../db';
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
  const token = signToken(user.id);
  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: userWithoutPassword,
    },
  });
};

export const register = asyncHandler(async (req: any, res: Response) => {
  const { name, username, email, password, role } = req.body;
  const currentUser = req.user;

  if (!currentUser) {
    if (role && role !== 'student') {
      throw new AppError('Public registration is restricted to students only.', 403);
    }
  }

  if (currentUser && currentUser.role === 'hr') {
    if (role && role !== 'student') {
      throw new AppError('HR can only onboard students.', 403);
    }
  }

  if (
    currentUser &&
    !['superadmin', 'admin', 'hr'].includes(currentUser.role) &&
    role &&
    role !== 'student'
  ) {
    throw new AppError('You do not have permission to register privileged accounts.', 403);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const userId = crypto.randomUUID();

  try {
    // 1) Create auth.users record, which triggers public.profiles insertion via handle_new_user()
    await prisma.users.create({
      data: {
        id: userId,
        email: email || `${username}@school.com`,
        encrypted_password: hashedPassword,
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date(), // marks email as verified; confirmed_at is a generated column so we do NOT set it
        raw_user_meta_data: {
          full_name: name,
          username: username.toLowerCase(),
          role: role || 'student',
        },
      },
    });

    // 2) Fetch the auto-created profile and sync any additional details
    const newUser = await prisma.profiles.update({
      where: { id: userId },
      data: {
        email: email || `${username}@school.com`,
      },
    });

    createSendToken(newUser, 201, res);
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new AppError('Username or email already exists. Please use different credentials.', 400);
    }
    throw err;
  }
});

export const onboardStaff = asyncHandler(async (req: any, res: Response) => {
  const { name, username, email, password, role, phone, address, city, state, pinCode, joiningDate, employeeId } = req.body;

  if (!name || !username || !password || !role) {
    throw new AppError('Missing required fields for staff onboarding', 400);
  }

  if (!['superadmin', 'admin'].includes(req.user.role)) {
    throw new AppError('Unauthorized: Only super administrators and administrators can onboard staff identities', 403);
  }

  const existingUser = await prisma.profiles.findFirst({
    where: {
      OR: [
        { username: username.toLowerCase() },
        ...(email ? [{ email: email.toLowerCase() }] : []),
      ],
    },
  });

  if (existingUser) {
    if (!existingUser.ref_id) {
      console.log(`[ONBOARD] Cleaning up orphaned user record for: ${existingUser.username}`);
      await prisma.users.delete({ where: { id: existingUser.id } });
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

  const hashedPassword = await bcrypt.hash(password, 12);
  const userId = crypto.randomUUID();

  let newProfile;
  try {
    // 1) Create auth.users record to trigger profile creation
    await prisma.users.create({
      data: {
        id: userId,
        email: email || `${username}@school.com`,
        encrypted_password: hashedPassword,
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date(),
        confirmed_at: new Date(),
        raw_user_meta_data: {
          full_name: name,
          username: username.toLowerCase(),
          role: role || 'teacher',
        },
      },
    });

    newProfile = await prisma.profiles.findUnique({
      where: { id: userId },
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new AppError('Username or email already exists. Please use different credentials.', 400);
    }
    throw err;
  }

  let profile;
  const commonData = {
    employee_id: employeeId || `STAFF-${Date.now().toString().slice(-6)}`,
    first_name: firstName,
    last_name: lastName,
    email: email || `${username}@school.com`,
    phone: phone || '000-000-0000',
    address: address || 'Main Campus',
    city: city || '',
    state: state || '',
    pin_code: pinCode || '',
    joining_date: joiningDate ? new Date(joiningDate) : new Date(),
    user_id: userId,
  };

  try {
    if (role === 'hr') {
      profile = await prisma.hr.create({
        data: commonData,
      });
    } else if (role === 'teacher') {
      profile = await prisma.teachers.create({
        data: {
          ...commonData,
          date_of_birth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : new Date('1990-01-01'),
          gender: req.body.gender || 'other',
          qualification: req.body.qualification || 'Not Specified',
          experience: req.body.experience ? Number(req.body.experience) : 0,
          salary: req.body.salary ? Number(req.body.salary) : 0,
        },
      });
    } else {
      throw new AppError('Only HR and teacher identities can be onboarded here.', 400);
    }
  } catch (profileError: any) {
    console.error(`[ONBOARD] Profile creation failed for ${username}. Rolling back User record.`, profileError.message);
    await prisma.users.delete({ where: { id: userId } });
    throw new AppError(`Failed to create ${role} profile: ${profileError.message}. The operation has been rolled back.`, 400);
  }

  if (profile && newProfile) {
    newProfile = await prisma.profiles.update({
      where: { id: userId },
      data: { ref_id: profile.id, email: email || `${username}@school.com` },
    });
  }

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: newProfile?.id,
        name: newProfile?.name,
        username: newProfile?.username,
        role: newProfile?.role,
        email: newProfile?.email,
        refId: newProfile?.ref_id,
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
      createSendToken({ ...user, id: 'mock-id-' + user.username }, 200, res);
      return;
    }

    console.warn(`[AUTH] Mock login failed for ${identifier}`);
    throw new AppError('Incorrect credentials (Mock Mode)', 401);
  }

  if (!identifier || !password) {
    throw new AppError('Please provide identifier (email/username) and password', 400);
  }

  const searchIdentifier = identifier.toLowerCase();
  const profile = await prisma.profiles.findFirst({
    where: {
      OR: [{ email: searchIdentifier }, { username: searchIdentifier }],
    },
    include: {
      users: true,
    },
  });

  if (!profile || !profile.users) {
    console.warn(`[AUTH] Login failed: No user found for ${searchIdentifier}`);
    throw new AppError('Incorrect credentials', 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, profile.users.encrypted_password || '');
  if (!isPasswordCorrect) {
    console.warn(`[AUTH] Login failed: Password mismatch for ${searchIdentifier}`);
    throw new AppError('Incorrect credentials', 401);
  }

  console.log(`[AUTH] Login successful for: ${profile.username} (${profile.role})`);
  
  const phone = await getUserPhone(profile.id, profile.role);

  // Transform profile to match client-side fields
  const userPayload = {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    role: profile.role,
    email: profile.email,
    avatar: profile.avatar,
    refId: profile.ref_id,
    phone,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
  
  createSendToken(userPayload, 200, res);
});

const getUserPhone = async (userId: string, role: string) => {
  try {
    if (role === 'student') {
      const student = await prisma.students.findFirst({ where: { user_id: userId } });
      if (student) return student.phone;
    } else if (role === 'teacher') {
      const teacher = await prisma.teachers.findFirst({ where: { user_id: userId } });
      if (teacher) return teacher.phone;
    } else if (role === 'hr') {
      const hr = await prisma.hr.findFirst({ where: { user_id: userId } });
      if (hr) return hr.phone;
    }
    
    // Fallback to auth.users table
    const authUser = await prisma.users.findUnique({ where: { id: userId } });
    return authUser?.phone || '';
  } catch (e) {
    return '';
  }
};

export const getMe = asyncHandler(async (req: any, res: Response) => {
  const phone = await getUserPhone(req.user.id, req.user.role);
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
        role: req.user.role,
        email: req.user.email,
        avatar: req.user.avatar,
        refId: req.user.ref_id,
        phone,
        createdAt: req.user.created_at,
        updatedAt: req.user.updated_at,
      },
    },
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.body;

  const searchIdentifier = identifier ? identifier.toLowerCase() : '';
  const profile = await prisma.profiles.findFirst({
    where: {
      OR: [{ email: searchIdentifier }, { username: searchIdentifier }],
    },
  });

  if (!profile) {
    console.warn(`[AUTH] Forgot password requested for unknown identifier: ${searchIdentifier}`);
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that identifier, a reset link has been sent.',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await prisma.users.update({
    where: { id: profile.id },
    data: {
      recovery_token: hashedToken,
      recovery_sent_at: new Date(),
    },
  });

  const originHeader = req.get('origin');
  const firstCors = (config.corsOrigin || '').split(',')[0].trim();
  const baseUrl = originHeader || config.frontendUrl || firstCors;
  const resetURL = `${baseUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;
  const message = `Forgot your password? Click the link to reset it: ${resetURL}\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: profile.email || 'admin@school.com',
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    const responsePayload: any = { success: true, message: 'Token sent to email!' };
    if (config.nodeEnv !== 'production') responsePayload.resetURL = resetURL;

    return res.status(200).json(responsePayload);
  } catch (err) {
    await prisma.users.update({
      where: { id: profile.id },
      data: {
        recovery_token: null,
        recovery_sent_at: null,
      },
    });

    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  // Check if token matches and is within 10 minutes
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const user = await prisma.users.findFirst({
    where: {
      recovery_token: hashedToken,
      recovery_sent_at: {
        gt: tenMinutesAgo,
      },
    },
    include: {
      profiles: true,
    },
  });

  if (!user || !user.profiles) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  await prisma.users.update({
    where: { id: user.id },
    data: {
      encrypted_password: hashedPassword,
      recovery_token: null,
      recovery_sent_at: null,
    },
  });

  createSendToken(user.profiles, 200, res);
});

export const updateMe = asyncHandler(async (req: any, res: Response) => {
  const { name, email, phone, avatar } = req.body;

  if (IS_MOCK_MODE) {
    const mockPath = path.join(__dirname, '../data/mockDB.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
    const userIdx = mockData.users.findIndex((u: any) => u.username === req.user.username);

    if (userIdx !== -1) {
      if (name) mockData.users[userIdx].name = name;
      if (email) mockData.users[userIdx].email = email;
      if (phone) mockData.users[userIdx].phone = phone;
      if (avatar) mockData.users[userIdx].avatar = avatar;
      fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2));
      return res.status(200).json({
        success: true,
        data: { user: mockData.users[userIdx] },
      });
    }
  }

  // 1. Update Profiles Table
  const updatedProfile = await prisma.profiles.update({
    where: { id: req.user.id },
    data: { 
      ...(name && { name }), 
      ...(email && { email }),
      ...(avatar !== undefined && { avatar }),
    },
  });

  // 2. Update Auth Users Table
  await prisma.users.update({
    where: { id: req.user.id },
    data: {
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      raw_user_meta_data: {
        ...(req.user.raw_user_meta_data as object),
        ...(name && { full_name: name }),
        ...(avatar !== undefined && { avatar }),
      }
    }
  });

  // 3. Update Role Specific Profile Table (students, teachers, hr)
  const nameParts = name ? name.trim().split(' ') : [];
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const commonRoleData = {
    ...(name && { first_name: firstName, last_name: lastName }),
    ...(email && { email }),
    ...(phone !== undefined && { phone }),
    ...(avatar !== undefined && { photo: avatar }),
  };

  if (updatedProfile.role === 'student') {
    const studentExists = await prisma.students.findFirst({ where: { user_id: req.user.id } });
    if (studentExists) {
      await prisma.students.updateMany({
        where: { user_id: req.user.id },
        data: commonRoleData,
      });
    }
  } else if (updatedProfile.role === 'teacher') {
    const teacherExists = await prisma.teachers.findFirst({ where: { user_id: req.user.id } });
    if (teacherExists) {
      await prisma.teachers.updateMany({
        where: { user_id: req.user.id },
        data: commonRoleData,
      });
    }
  } else if (updatedProfile.role === 'hr') {
    const hrExists = await prisma.hr.findFirst({ where: { user_id: req.user.id } });
    if (hrExists) {
      await prisma.hr.updateMany({
        where: { user_id: req.user.id },
        data: commonRoleData,
      });
    }
  }

  // Fetch updated profile to return
  const finalProfile = await prisma.profiles.findUnique({
    where: { id: req.user.id },
  });

  // Fetch user object to get phone
  const authUser = await prisma.users.findUnique({
    where: { id: req.user.id },
  });

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: finalProfile?.id,
        name: finalProfile?.name,
        username: finalProfile?.username,
        role: finalProfile?.role,
        email: finalProfile?.email,
        avatar: finalProfile?.avatar,
        refId: finalProfile?.ref_id,
        phone: authUser?.phone || '',
        createdAt: finalProfile?.created_at,
        updatedAt: finalProfile?.updated_at,
      },
    },
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
      createSendToken({ ...user, id: 'mock-id-' + user.username }, 200, res);
      return;
    }
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: req.user.id },
    include: {
      users: true,
    },
  });

  if (!profile || !profile.users) {
    throw new AppError('User not found', 404);
  }

  const isPasswordCorrect = await bcrypt.compare(passwordCurrent, profile.users.encrypted_password || '');
  if (!isPasswordCorrect) {
    throw new AppError('Your current password is wrong', 401);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.users.update({
    where: { id: req.user.id },
    data: { encrypted_password: hashedPassword },
  });

  createSendToken(profile, 200, res);
});
