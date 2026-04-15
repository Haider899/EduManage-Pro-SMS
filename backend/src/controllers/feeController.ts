import { Request, Response } from 'express';
import Fee from '../models/Fee';
import { asyncHandler } from '../utils/asyncHandler';

export const getLedger = asyncHandler(async (_req: Request, res: Response) => {
  const fees = await Fee.find().populate('student', 'firstName lastName rollNumber').sort({ createdAt: -1 });
  
  res.json({
    success: true,
    data: fees,
    message: 'Ledger data compiled successfully'
  });
});
