import { Request, Response } from 'express';
import prisma from '../db';
import { asyncHandler } from '../utils/asyncHandler';

export const getFullReport = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalStudents,
    totalTeachers,
    totalNotices,
    // Fee breakdown by status
    paidFees,
    pendingFees,
    overdueFees,
    // Attendance breakdown by status
    presentCount,
    absentCount,
    lateCount
  ] = await Promise.all([
    prisma.students.count(),
    prisma.teachers.count(),
    prisma.notices.count(),
    // Fee aggregations
    prisma.fees.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true },
      _count: true
    }),
    prisma.fees.aggregate({
      where: { status: 'pending' },
      _sum: { amount: true },
      _count: true
    }),
    prisma.fees.aggregate({
      where: { status: 'overdue' },
      _sum: { amount: true },
      _count: true
    }),
    // Attendance aggregations
    prisma.attendance.count({ where: { status: 'present' } }),
    prisma.attendance.count({ where: { status: 'absent' } }),
    prisma.attendance.count({ where: { status: 'late' } })
  ]);

  // Build structured fee stats
  const feeStats = [
    { _id: 'paid',    totalAmount: Number(paidFees._sum.amount    ?? 0), count: paidFees._count    },
    { _id: 'pending', totalAmount: Number(pendingFees._sum.amount  ?? 0), count: pendingFees._count  },
    { _id: 'overdue', totalAmount: Number(overdueFees._sum.amount  ?? 0), count: overdueFees._count  }
  ];

  const attendanceStats = [
    { _id: 'present', count: presentCount },
    { _id: 'absent',  count: absentCount  },
    { _id: 'late',    count: lateCount    }
  ];

  // Simple trend placeholder (identical to original)
  const trends = {
    admissions: [12, 19, 3, 5, 2, 3, 7, 10, 15, 20, 25, 30],
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
