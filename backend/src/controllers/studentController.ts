import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../db';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';

export const getAllStudents = asyncHandler(async (_req: Request, res: Response) => {
  const students = await prisma.students.findMany({
    include: {
      classes: true,
    },
  });

  const mappedStudents = students.map((student) => ({
    id: student.id,
    rollNumber: student.roll_number,
    firstName: student.first_name,
    lastName: student.last_name,
    email: student.email,
    phone: student.phone,
    dateOfBirth: student.date_of_birth,
    gender: student.gender,
    class: student.classes ? student.classes.name : student.class_id,
    classId: student.class_id,
    section: student.section,
    address: student.address,
    city: student.city,
    state: student.state,
    pinCode: student.pin_code,
    parentName: student.parent_name,
    parentPhone: student.parent_phone,
    parentEmail: student.parent_email,
    admissionDate: student.admission_date,
    photo: student.photo,
    status: student.status,
    createdAt: student.created_at,
    updatedAt: student.updated_at,
  }));

  res.json({
    success: true,
    data: mappedStudents,
  });
});

export const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  const student = await prisma.students.findUnique({
    where: { id: req.params.id },
    include: {
      classes: true,
    },
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  const mappedStudent = {
    id: student.id,
    rollNumber: student.roll_number,
    firstName: student.first_name,
    lastName: student.last_name,
    email: student.email,
    phone: student.phone,
    dateOfBirth: student.date_of_birth,
    gender: student.gender,
    class: student.classes ? student.classes.name : student.class_id,
    classId: student.class_id,
    section: student.section,
    address: student.address,
    city: student.city,
    state: student.state,
    pinCode: student.pin_code,
    parentName: student.parent_name,
    parentPhone: student.parent_phone,
    parentEmail: student.parent_email,
    admissionDate: student.admission_date,
    photo: student.photo,
    status: student.status,
    createdAt: student.created_at,
    updatedAt: student.updated_at,
  };

  res.json({
    success: true,
    data: mappedStudent,
  });
});

export const createStudent = asyncHandler(async (req: any, res: Response) => {
  const {
    name,
    email,
    username,
    password,
    rollNumber,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    class: classVal,
    classId,
    section,
    address,
    city,
    state,
    pinCode,
    parentName,
    parentPhone,
    parentEmail,
    admissionDate,
    photo,
    status,
    schoolId,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password || 'Student123!', 12);
  const userId = crypto.randomUUID();

  // Find class_id from class name if classId was not directly passed
  let finalClassId = classId;
  if (!finalClassId && classVal) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(classVal);
    if (isUUID) {
      finalClassId = classVal;
    } else {
      const cls = await prisma.classes.findFirst({
        where: { name: classVal },
      });
      if (cls) {
        finalClassId = cls.id;
      }
    }
  }

  // 1) Create User record (triggers public.profiles creation)
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
        username: (username || rollNumber).toLowerCase(),
        role: 'student',
      },
    },
  });

  try {
    // 2) Create Student Profile
    const student = await prisma.students.create({
      data: {
        school_id: schoolId || null,
        user_id: userId,
        roll_number: rollNumber,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        date_of_birth: new Date(dateOfBirth),
        gender: gender || 'other',
        class_id: finalClassId,
        section,
        address,
        city,
        state,
        pin_code: pinCode,
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_email: parentEmail,
        admission_date: admissionDate ? new Date(admissionDate) : new Date(),
        photo,
        status: status || 'active',
      },
    });

    // 3) Update profiles ref_id
    const updatedProfile = await prisma.profiles.update({
      where: { id: userId },
      data: { ref_id: student.id, email },
    });

    res.status(201).json({
      success: true,
      data: {
        student,
        user: {
          id: updatedProfile.id,
          username: updatedProfile.username,
          role: updatedProfile.role,
        },
      },
      message: 'Student onboarded successfully with portal access',
    });
  } catch (error) {
    // Rollback User Creation if Student Profile fails
    await prisma.users.delete({ where: { id: userId } });
    throw error;
  }
});

export const createBulkStudents = asyncHandler(async (req: any, res: Response) => {
  const studentsList = req.body.students;
  if (!Array.isArray(studentsList)) {
    throw new AppError('Invalid data format. Expected an array of students.', 400);
  }

  const results = [];
  for (const data of studentsList) {
    const userId = crypto.randomUUID();
    let userCreated = false;
    try {
      const hashedPassword = await bcrypt.hash(data.password || 'Student123!', 12);
      
      // Find class_id from class name
      let finalClassId = data.classId;
      if (!finalClassId && data.class) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.class);
        if (isUUID) {
          finalClassId = data.class;
        } else {
          const cls = await prisma.classes.findFirst({
            where: { name: data.class },
          });
          if (cls) {
            finalClassId = cls.id;
          }
        }
      }

      // Create User
      await prisma.users.create({
        data: {
          id: userId,
          email: data.email,
          encrypted_password: hashedPassword,
          aud: 'authenticated',
          role: 'authenticated',
          email_confirmed_at: new Date(),
          confirmed_at: new Date(),
          raw_user_meta_data: {
            full_name: data.name || `${data.firstName} ${data.lastName}`,
            username: (data.username || data.rollNumber || data.roll_number).toLowerCase(),
            role: 'student',
          },
        },
      });
      userCreated = true;

      // Create Student Profile
      const student = await prisma.students.create({
        data: {
          school_id: data.schoolId || null,
          user_id: userId,
          roll_number: data.rollNumber || data.roll_number,
          first_name: data.firstName || data.first_name,
          last_name: data.lastName || data.last_name,
          email: data.email,
          phone: data.phone,
          date_of_birth: new Date(data.dateOfBirth || data.date_of_birth),
          gender: data.gender || 'other',
          class_id: finalClassId,
          section: data.section,
          address: data.address,
          city: data.city,
          state: data.state,
          pin_code: data.pinCode || data.pin_code,
          parent_name: data.parentName || data.parent_name,
          parent_phone: data.parentPhone || data.parent_phone,
          parent_email: data.parentEmail || data.parent_email,
          admission_date: data.admissionDate || data.admission_date ? new Date(data.admissionDate || data.admission_date) : new Date(),
          photo: data.photo,
          status: data.status || 'active',
        },
      });

      // Update User with ref_id
      await prisma.profiles.update({
        where: { id: userId },
        data: { ref_id: student.id, email: data.email },
      });

      results.push({ student, userId });
    } catch (err) {
      console.error(`Failed to import student: ${data.name || data.rollNumber}`, err);
      if (userCreated) {
        try {
          await prisma.users.delete({ where: { id: userId } });
        } catch (rollbackErr) {
          console.error(`Rollback failed for user ${userId}:`, rollbackErr);
        }
      }
    }
  }

  res.status(201).json({
    success: true,
    data: results,
    count: results.length,
    message: `Successfully imported ${results.length} students`,
  });
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const data: any = { ...req.body };
  
  if (data.dateOfBirth || data.date_of_birth) {
    data.date_of_birth = new Date(data.dateOfBirth || data.date_of_birth);
    delete data.dateOfBirth;
  }
  if (data.admissionDate || data.admission_date) {
    data.admission_date = new Date(data.admissionDate || data.admission_date);
    delete data.admissionDate;
  }
  if (data.rollNumber) {
    data.roll_number = data.rollNumber;
    delete data.rollNumber;
  }
  if (data.firstName) {
    data.first_name = data.firstName;
    delete data.firstName;
  }
  if (data.lastName) {
    data.last_name = data.lastName;
    delete data.lastName;
  }
  if (data.pinCode) {
    data.pin_code = data.pinCode;
    delete data.pinCode;
  }
  if (data.parentName) {
    data.parent_name = data.parentName;
    delete data.parentName;
  }
  if (data.parentPhone) {
    data.parent_phone = data.parentPhone;
    delete data.parentPhone;
  }
  if (data.parentEmail) {
    data.parent_email = data.parentEmail;
    delete data.parentEmail;
  }
  if (data.class || data.classId) {
    data.class_id = data.classId || data.class;
    delete data.class;
    delete data.classId;
  }

  const student = await prisma.students.update({
    where: { id: req.params.id },
    data,
  });

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
  const student = await prisma.students.findUnique({
    where: { id: req.params.id },
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Delete matching auth.users record, which will cascadingly delete profiles and references.
  if (student.user_id) {
    await prisma.users.delete({
      where: { id: student.user_id },
    });
  } else {
    // Fallback if no user is linked
    await prisma.students.delete({
      where: { id: req.params.id },
    });
  }

  res.json({
    success: true,
    message: 'Student deleted successfully',
  });
});
