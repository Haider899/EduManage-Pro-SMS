import { Request, Response } from 'express';
import Teacher from '../models/Teacher';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';

export const getAllTeachers = asyncHandler(async (_req: Request, res: Response) => {
  const teachers = await Teacher.find();
  res.json({
    success: true,
    data: teachers,
  });
});

export const getTeacherById = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }
  res.json({
    success: true,
    data: teacher,
  });
});

export const createTeacher = asyncHandler(async (req: any, res: Response) => {
  // 1) Create User for login access
  const { name, email, username, password } = req.body;
  
  // Create User
  const user = await User.create({
    name,
    email,
    username,
    password,
    role: 'teacher'
  });

  try {
    // 2) Create Teacher Profile
    const teacherData = {
      ...req.body,
      userId: user._id, // Link to User
    };
    
    const teacher = new Teacher(teacherData);
    await teacher.save();

    res.status(201).json({
      success: true,
      data: teacher,
      message: 'Teacher created successfully',
    });
  } catch (error) {
    // If teacher creation fails, delete the user
    await User.findByIdAndDelete(user._id);
    throw error;
  }
});

export const updateTeacher = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
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
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }
  res.json({
    success: true,
    message: 'Teacher deleted successfully',
  });
});
