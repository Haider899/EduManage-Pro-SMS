import { Request, Response } from 'express';
import Attendance from '../models/Attendance';

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, classId, date } = req.query;
    const query: any = {};

    if (studentId) query.student = studentId;
    if (classId) query.class = classId;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('student')
      .populate('class')
      .populate('markedBy');

    res.json({
      success: true,
      data: attendance,
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
    const attendance = new Attendance(req.body);
    await attendance.save();
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

export const getStudentAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId })
      .populate('class')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance',
      error,
    });
  }
};
