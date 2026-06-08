import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../db';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';

export const getAllTeachers = asyncHandler(async (_req: Request, res: Response) => {
  const teachers = await prisma.teachers.findMany();
  
  const mappedTeachers = teachers.map(teacher => ({
    id: teacher.id,
    employeeId: teacher.employee_id,
    firstName: teacher.first_name,
    lastName: teacher.last_name,
    email: teacher.email,
    phone: teacher.phone,
    dateOfBirth: teacher.date_of_birth,
    gender: teacher.gender,
    qualification: teacher.qualification,
    experience: teacher.experience,
    specialization: teacher.specialization ? teacher.specialization.split(',') : [],
    joiningDate: teacher.joining_date,
    salary: teacher.salary ? Number(teacher.salary) : 0,
    address: teacher.address,
    city: teacher.city,
    state: teacher.state,
    pinCode: teacher.pin_code,
    photo: teacher.photo,
    status: teacher.status,
    createdAt: teacher.created_at,
    updatedAt: teacher.updated_at,
  }));

  res.json({
    success: true,
    data: mappedTeachers,
  });
});

export const getTeacherById = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await prisma.teachers.findUnique({
    where: { id: req.params.id },
  });

  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }

  const mappedTeacher = {
    id: teacher.id,
    employeeId: teacher.employee_id,
    firstName: teacher.first_name,
    lastName: teacher.last_name,
    email: teacher.email,
    phone: teacher.phone,
    dateOfBirth: teacher.date_of_birth,
    gender: teacher.gender,
    qualification: teacher.qualification,
    experience: teacher.experience,
    specialization: teacher.specialization ? teacher.specialization.split(',') : [],
    joiningDate: teacher.joining_date,
    salary: teacher.salary ? Number(teacher.salary) : 0,
    address: teacher.address,
    city: teacher.city,
    state: teacher.state,
    pinCode: teacher.pin_code,
    photo: teacher.photo,
    status: teacher.status,
    createdAt: teacher.created_at,
    updatedAt: teacher.updated_at,
  };

  res.json({
    success: true,
    data: mappedTeacher,
  });
});

export const createTeacher = asyncHandler(async (req: any, res: Response) => {
  // 1) Create User for login access
  const {
    name,
    email,
    username,
    password,
    employeeId,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    qualification,
    experience,
    specialization,
    joiningDate,
    salary,
    address,
    city,
    state,
    pinCode,
    photo,
    status,
    schoolId
  } = req.body;
  
  const hashedPassword = await bcrypt.hash(password || 'Teacher123!', 12);
  const userId = crypto.randomUUID();

  // Create User (triggers public.profiles creation)
  await prisma.users.create({
    data: {
      id: userId,
      email: email,
      encrypted_password: hashedPassword,
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date(),
      confirmed_at: new Date(),
      raw_user_meta_data: {
        full_name: name || `${firstName} ${lastName}`,
        username: (username || employeeId || email.split('@')[0]).toLowerCase(),
        role: 'teacher'
      }
    }
  });

  try {
    // 2) Create Teacher Profile
    const specString = Array.isArray(specialization) ? specialization.join(',') : specialization;
    const teacher = await prisma.teachers.create({
      data: {
        school_id: schoolId || null,
        user_id: userId,
        employee_id: employeeId || `STAFF-${Date.now().toString().slice(-6)}`,
        first_name: firstName || name.split(' ')[0],
        last_name: lastName || name.split(' ').slice(1).join(' ') || 'Staff',
        email,
        phone: phone || '000-000-0000',
        date_of_birth: dateOfBirth ? new Date(dateOfBirth) : new Date('1990-01-01'),
        gender: gender || 'other',
        qualification: qualification || 'Not Specified',
        experience: experience ? Number(experience) : 0,
        specialization: specString || null,
        joining_date: joiningDate ? new Date(joiningDate) : new Date(),
        salary: salary ? Number(salary) : 0,
        address: address || null,
        city: city || null,
        state: state || null,
        pin_code: pinCode || null,
        photo: photo || 'https://via.placeholder.com/150',
        status: status || 'active',
      },
    });

    // 3) Update profiles ref_id
    await prisma.profiles.update({
      where: { id: userId },
      data: { ref_id: teacher.id, email }
    });

    res.status(201).json({
      success: true,
      data: teacher,
      message: 'Teacher created successfully',
    });
  } catch (error) {
    // If teacher creation fails, delete the user
    await prisma.users.delete({ where: { id: userId } });
    throw error;
  }
});

export const updateTeacher = asyncHandler(async (req: Request, res: Response) => {
  const data: any = { ...req.body };

  if (data.dateOfBirth || data.date_of_birth) {
    data.date_of_birth = new Date(data.dateOfBirth || data.date_of_birth);
    delete data.dateOfBirth;
  }
  if (data.joiningDate || data.joining_date) {
    data.joining_date = new Date(data.joiningDate || data.joining_date);
    delete data.joiningDate;
  }
  if (data.firstName) {
    data.first_name = data.firstName;
    delete data.firstName;
  }
  if (data.lastName) {
    data.last_name = data.lastName;
    delete data.lastName;
  }
  if (data.employeeId) {
    data.employee_id = data.employeeId;
    delete data.employeeId;
  }
  if (data.pinCode) {
    data.pin_code = data.pinCode;
    delete data.pinCode;
  }
  if (data.specialization) {
    data.specialization = Array.isArray(data.specialization) ? data.specialization.join(',') : data.specialization;
  }
  if (data.experience) {
    data.experience = Number(data.experience);
  }
  if (data.salary) {
    data.salary = Number(data.salary);
  }

  const teacher = await prisma.teachers.update({
    where: { id: req.params.id },
    data,
  });

  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }

  res.json({
    success: true,
    data: teacher,
    message: 'Teacher updated successfully',
  });
});

export const deleteTeacher = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await prisma.teachers.findUnique({
    where: { id: req.params.id },
  });

  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }

  // Delete matching auth.users record, which will cascadingly delete profiles and references.
  if (teacher.user_id) {
    await prisma.users.delete({
      where: { id: teacher.user_id },
    });
  } else {
    // Fallback if no user is linked
    await prisma.teachers.delete({
      where: { id: req.params.id },
    });
  }

  res.json({
    success: true,
    message: 'Teacher deleted successfully',
  });
});
