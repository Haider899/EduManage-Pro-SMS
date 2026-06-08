import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';
import { leave_status, leave_category } from '@prisma/client';
import { AppError } from '../middleware/errorMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

export const applyLeave = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate, reason, category, schoolId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const leave = await prisma.leaves.create({
    data: {
      user_id: userId,
      school_id: schoolId || null,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      reason,
      category: category as leave_category,
      status: leave_status.pending
    }
  });

  res.status(201).json({ success: true, data: leave });
});

export const getLeaves = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.query;

  const leaves = await prisma.leaves.findMany({
    where: {
      ...(userId ? { user_id: userId as string } : {})
    },
    include: {
      profiles: {
        select: { id: true, name: true, role: true, email: true }
      },
      approver: {
        select: { id: true, name: true, role: true }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  const mapped = leaves.map(l => ({
    id: l.id,
    startDate: l.start_date,
    endDate: l.end_date,
    reason: l.reason,
    status: l.status,
    category: l.category,
    user: l.profiles
      ? { id: l.profiles.id, name: l.profiles.name, role: l.profiles.role, email: l.profiles.email }
      : null,
    approvedBy: l.approver
      ? { id: l.approver.id, name: l.approver.name }
      : null,
    createdAt: l.created_at,
    updatedAt: l.updated_at
  }));

  res.json({ success: true, data: mapped });
});

export const updateLeaveStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;

  const updated = await prisma.leaves.update({
    where: { id },
    data: {
      status: status as leave_status,
      ...(approvedBy ? { approver_id: approvedBy } : {})
    }
  });

  res.json({ success: true, data: updated });
});
