import { Request, Response } from 'express';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Fee from '../models/Fee';
import Attendance from '../models/Attendance';
import Notice from '../models/Notice';
import { asyncHandler } from '../utils/asyncHandler';

export const getFullReport = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalStudents,
    totalTeachers,
    totalNotices,
    feeStats,
    attendanceStats
  ] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Notice.countDocuments(),
    Fee.aggregate([
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]),
    Attendance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  // Calculate trends (Simple mock data for now, would use time-based aggregation in production)
  const trends = {
    admissions: [12, 19, 3, 5, 2, 3, 7, 10, 15, 20, 25, 30], // Monthly
    revenue: [5000, 7000, 4500, 6000, 8000, 9500, 11000, 12000, 15000, 14000, 16000, 18000]
  };

  res.json({
    success: true,
    data: {
      overview: {
        totalStudents,
        totalTeachers,
        totalNotices
      },
      financials: feeStats,
      attendance: attendanceStats,
      trends
    }
  });
});
