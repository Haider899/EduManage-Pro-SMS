import mongoose, { Schema, Document } from 'mongoose';

export interface IFee extends Document {
  student: mongoose.Types.ObjectId;
  feeType: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: 'cash' | 'check' | 'online' | 'transfer';
  transactionId?: string;
  remarks: string;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema = new Schema<IFee>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    feeType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'check', 'online', 'transfer'],
    },
    transactionId: String,
    remarks: String,
    academicYear: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

FeeSchema.index({ student: 1, academicYear: 1 });

export default mongoose.model<IFee>('Fee', FeeSchema);
