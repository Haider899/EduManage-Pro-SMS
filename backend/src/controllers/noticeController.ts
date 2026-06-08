import { Request, Response } from 'express';
import prisma from '../db';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';
import { AuthRequest } from '../middleware/authMiddleware';

export const createNotice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, priority, schoolId } = req.body;
  const authorId = req.user?.id;

  if (!authorId) {
    throw new AppError('Unauthorized', 401);
  }

  const notice = await prisma.notices.create({
    data: {
      title,
      content,
      priority: priority || 'normal',
      school_id: schoolId || null,
      author_id: authorId
    },
    include: {
      profiles: {
        select: { id: true, name: true, role: true }
      }
    }
  });

  res.status(201).json({
    success: true,
    data: {
      id: notice.id,
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      author: notice.profiles,
      createdAt: notice.created_at
    },
    message: 'Notice issued successfully'
  });
});

export const getNotices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notices = await prisma.notices.findMany({
    where: req.user?.school_id ? { school_id: req.user.school_id } : {},
    include: {
      profiles: {
        select: { id: true, name: true, role: true }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  const mapped = notices.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    priority: n.priority,
    author: n.profiles,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  }));

  res.json({ success: true, data: mapped });
});

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const notice = await prisma.notices.findUnique({ where: { id } });
  if (!notice) throw new AppError('Notice not found', 404);

  await prisma.notices.delete({ where: { id } });

  res.json({ success: true, message: 'Notice deleted successfully' });
});
