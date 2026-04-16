import { Request, Response } from 'express';
import Leave from '../models/Leave';
import { AuthRequest } from '../middleware/authMiddleware';

export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const payload = { ...req.body, user: req.user?._id };
    const l = new Leave(payload);
    await l.save();
    res.status(201).json({ success: true, data: l });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error applying leave', error });
  }
};

export const getLeaves = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const filter: any = {};
    if (userId) filter.user = userId;
    const leaves = await Leave.find(filter).populate('user').sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leaves', error });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, comments } = req.body;
    const l = await Leave.findByIdAndUpdate(id, { status, approvedBy, comments }, { new: true });
    res.json({ success: true, data: l });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating leave', error });
  }
};
