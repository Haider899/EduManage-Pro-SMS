import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, classId, date } = req.query;
    const where: any = {};

    if (studentId) where.student_id = studentId as string;
    if (classId) where.class_id = classId as string;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.date = { gte: startDate, lt: endDate };
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        students: true,
        classes: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    const mapped = attendance.map(item => ({
      id: item.id,
      student: item.students ? {
        id: item.students.id,
        firstName: item.students.first_name,
        lastName: item.students.last_name,
        rollNumber: item.students.roll_number
      } : null,
      class: item.classes ? {
        id: item.classes.id,
        name: item.classes.name,
        section: item.classes.section
      } : null,
      date: item.date,
      status: item.status,
      remarks: item.remarks,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    res.json({
      success: true,
      data: mapped,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error,
    });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, classId, date, status, remarks, schoolId } = req.body;

    const attendance = await prisma.attendance.create({
      data: {
        school_id: schoolId || null,
        student_id: studentId,
        class_id: classId,
        date: date ? new Date(date) : new Date(),
        status: status,
        remarks: remarks || ''
      }
    });

    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Attendance marked successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error marking attendance',
      error,
    });
  }
};

export const markAttendanceBulk = async (req: AuthRequest, res: Response) => {
  try {
    const { date, entries, schoolId } = req.body;
    if (!Array.isArray(entries)) {
      return res.status(400).json({ success: false, message: 'Entries array required' });
    }

    const marks = entries.map((e: any) => ({
      school_id: schoolId || null,
      student_id: e.student || e.studentId,
      class_id: e.class || e.classId,
      date: date ? new Date(date) : new Date(),
      status: e.present ? 'present' : (e.status || 'absent'),
      remarks: e.remarks || '',
    }));

    // In Prisma, we can do a createMany or run in transaction. Let's do createMany:
    await prisma.attendance.createMany({
      data: marks
    });

    return res.status(201).json({ success: true, message: 'Bulk attendance marked successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Error marking attendance bulk', error });
  }
};

export const getStudentAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const attendance = await prisma.attendance.findMany({
      where: { student_id: studentId },
      include: {
        classes: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    const mapped = attendance.map(item => ({
      id: item.id,
      class: item.classes ? {
        id: item.classes.id,
        name: item.classes.name,
        section: item.classes.section
      } : null,
      date: item.date,
      status: item.status,
      remarks: item.remarks,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    res.json({
      success: true,
      data: mapped,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance',
      error,
    });
  }
};
