import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorMiddleware';

export const createMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, date, schoolId, participantIds } = req.body;
  const organizerId = req.user?.id;

  if (!organizerId) {
    throw new AppError('Unauthorized', 401);
  }

  const meeting = await prisma.meetings.create({
    data: {
      title,
      description: description || null,
      date: new Date(date),
      school_id: schoolId || null,
      organizer_id: organizerId,
      participants: participantIds && participantIds.length > 0
        ? {
            create: (participantIds as string[]).map((uid: string) => ({
              user_id: uid
            }))
          }
        : undefined
    },
    include: {
      profiles: {
        select: { id: true, name: true, role: true }
      },
      participants: {
        include: {
          profiles: {
            select: { id: true, name: true, role: true }
          }
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    data: {
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      organizer: meeting.profiles,
      participants: meeting.participants.map(p => p.profiles),
      createdAt: meeting.created_at
    },
    message: 'Meeting scheduled successfully'
  });
});

export const getMeetings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const meetings = await prisma.meetings.findMany({
    where: {
      OR: [
        { organizer_id: userId },
        {
          participants: {
            some: { user_id: userId }
          }
        }
      ]
    },
    include: {
      profiles: {
        select: { id: true, name: true, role: true }
      },
      participants: {
        include: {
          profiles: {
            select: { id: true, name: true, role: true }
          }
        }
      }
    },
    orderBy: { date: 'asc' }
  });

  const mapped = meetings.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    date: m.date,
    organizer: m.profiles,
    participants: m.participants.map(p => p.profiles),
    createdAt: m.created_at
  }));

  res.json({ success: true, data: mapped });
});
