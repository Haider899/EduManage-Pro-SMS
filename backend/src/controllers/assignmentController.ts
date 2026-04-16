import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const payload = { ...req.body, createdBy: req.user?._id };
    const a = new Assignment(payload);
    await a.save();
    res.status(201).json({ success: true, data: a });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating assignment', error });
  }
};

export const getAssignments = async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().populate('createdBy').sort({ createdAt: -1 });
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting assignment', error });
  }
};
