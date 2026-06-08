import { Request, Response } from 'express';
import prisma from '../db';
import { asyncHandler } from '../utils/asyncHandler';

export const getLedger = asyncHandler(async (_req: Request, res: Response) => {
  const feesList = await prisma.fees.findMany({
    include: {
      students: true
    },
    orderBy: { created_at: 'desc' }
  });

  const mapped = feesList.map(fee => ({
    id: fee.id,
    student: fee.students ? {
      id: fee.students.id,
      firstName: fee.students.first_name,
      lastName: fee.students.last_name,
      rollNumber: fee.students.roll_number
    } : null,
    studentId: fee.student_id,
    amount: fee.amount ? Number(fee.amount) : 0,
    dueDate: fee.due_date,
    status: fee.status,
    paymentDate: fee.payment_date,
    paymentMethod: fee.payment_method,
    transactionId: fee.transaction_id,
    createdAt: fee.created_at,
    updatedAt: fee.updated_at
  }));
  
  res.json({
    success: true,
    data: mapped,
    message: 'Ledger data compiled successfully'
  });
});
