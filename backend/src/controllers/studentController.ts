import { Request, Response } from 'express';
import Student from '../models/Student';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';

export const getAllStudents = asyncHandler(async (_req: Request, res: Response) => {
  const students = await Student.find().populate('class');
  res.json({
    success: true,
    data: students,
  });
});

export const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.id).populate('class');
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  res.json({
    success: true,
    data: student,
  });
});

export const createStudent = asyncHandler(async (req: any, res: Response) => {
  // 1) Create User for login access
  const { name, email, username, password } = req.body;
  
  // Create User
  const user = await User.create({
    name,
    email,
    username,
    password,
    role: 'student'
  });

  try {
    // 2) Create Student Profile
    const studentData = {
      ...req.body,
      userId: user._id, // Link to User
    };
    
    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      success: true,
      data: {
        student,
        user: {
          _id: user._id,
          username: user.username,
          role: user.role
        }
      },
      message: 'Student onboarded successfully with portal access',
    });
  } catch (error) {
    // 3) CRITICAL FIX: Rollback User Creation if Student Profile fails
    await User.findByIdAndDelete(user._id);
    throw error; // Let the global error handler catch and display the exact reason (e.g. ValidationError)
  }
});

export const createBulkStudents = asyncHandler(async (req: any, res: Response) => {
  const students = req.body.students; // Array of student objects
  if (!Array.isArray(students)) {
    throw new AppError('Invalid data format. Expected an array of students.', 400);
  }

  const results = [];
  for (const data of students) {
    try {
      // Create User
      const user = await User.create({
        name: data.name || `${data.firstName} ${data.lastName}`,
        email: data.email,
        username: data.username || data.rollNumber.toLowerCase(),
        password: data.password || 'Student123!', // Default password
        role: 'student'
      });

      // Create Student Profile
      const student = new Student({
        ...data,
        userId: user._id
      });
      await student.save();
      results.push({ student, userId: user._id });
    } catch (err) {
      console.error(`Failed to import student: ${data.name || data.rollNumber}`, err);
    }
  }

  res.status(201).json({
    success: true,
    data: results,
    count: results.length,
    message: `Successfully imported ${results.length} students`
  });
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  res.json({
    success: true,
    data: student,
    message: 'Student updated successfully',
  });
});

export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  res.json({
    success: true,
    message: 'Student deleted successfully',
  });
});

