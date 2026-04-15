import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'cancelled' | 'completed';
  organizer: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  link?: string; // For online meetings
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    link: String,
    location: String,
  },
  { timestamps: true }
);

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
