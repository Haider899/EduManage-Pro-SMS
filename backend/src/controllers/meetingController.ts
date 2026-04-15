import { Response } from 'express';
import Meeting from '../models/Meeting';
import { asyncHandler } from '../utils/asyncHandler';

export const createMeeting = asyncHandler(async (req: any, res: Response) => {
  const meeting = await Meeting.create({
    ...req.body,
    organizer: req.user._id || req.user.id,
  });

  res.status(201).json({
    success: true,
    data: meeting,
    message: 'Meeting scheduled successfully',
  });
});

export const getMeetings = asyncHandler(async (req: any, res: Response) => {
  const meetings = await Meeting.find({
    $or: [
      { organizer: req.user._id },
      { participants: req.user._id }
    ]
  }).sort({ startTime: 1 }).populate('organizer', 'name');

  res.json({
    success: true,
    data: meetings,
  });
});
