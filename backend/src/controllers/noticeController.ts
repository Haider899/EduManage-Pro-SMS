import { Request, Response } from 'express';
import Notice from '../models/Notice';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';

export const createNotice = asyncHandler(async (req: any, res: Response) => {
  const { title, content, category, targetRoles, expiresAt } = req.body;

  const notice = await Notice.create({
    title,
    content,
    category,
    targetRoles,
    expiresAt,
    author: req.user._id || req.user.id,
  });

  res.status(201).json({
    success: true,
    data: notice,
    message: 'Notice issued successfully',
  });
});

export const getNotices = asyncHandler(async (req: any, res: Response) => {
  // Filters notices based on target role or shows all if admin
  const query: any = {};
  if (req.user.role !== 'admin') {
    query.targetRoles = { $in: ['all', req.user.role] };
  }

  const notices = await Notice.find(query).sort({ createdAt: -1 }).populate('author', 'name');

  res.json({
    success: true,
    data: notices,
  });
});

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) throw new AppError('Notice not found', 404);

  res.json({
    success: true,
    message: 'Notice deleted successfully',
  });
});
