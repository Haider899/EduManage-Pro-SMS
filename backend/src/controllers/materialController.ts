import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';
import { AppError } from '../middleware/errorMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

export const uploadMaterial = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, classId, schoolId, files } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const material = await prisma.materials.create({
    data: {
      school_id: schoolId || null,
      title: title || null,
      class_id: classId || null,
      files: files || [],
      uploaded_by_user_id: userId
    }
  });

  res.status(201).json({ success: true, data: material });
});

export const getMaterials = asyncHandler(async (_req: Request, res: Response) => {
  const materials = await prisma.materials.findMany({
    include: {
      profiles: {
        select: { id: true, name: true, role: true }
      },
      classes: {
        select: { id: true, name: true, section: true }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  const mapped = materials.map(m => ({
    id: m.id,
    title: m.title,
    files: m.files,
    classId: m.class_id,
    class: m.classes
      ? { id: m.classes.id, name: m.classes.name, section: m.classes.section }
      : null,
    uploadedBy: m.profiles
      ? { id: m.profiles.id, name: m.profiles.name, role: m.profiles.role }
      : null,
    createdAt: m.created_at,
    updatedAt: m.updated_at
  }));

  res.json({ success: true, data: mapped });
});
