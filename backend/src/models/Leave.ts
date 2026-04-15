import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  user: mongoose.Types.ObjectId;
  type: 'sick' | 'casual' | 'vacation' | 'emergency';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  comments?: string;
}

const leaveSchema = new Schema<ILeave>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['sick', 'casual', 'vacation', 'emergency'],
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILeave>('Leave', leaveSchema);
