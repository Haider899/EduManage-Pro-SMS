import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetable extends Document {
  class: mongoose.Types.ObjectId;
  dayOfWeek: number;
  subject: string;
  teacher: mongoose.Types.ObjectId;
  startTime: string;
  endTime: string;
  room: string;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimetableSchema = new Schema<ITimetable>(
  {
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    subject: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

TimetableSchema.index({ class: 1, dayOfWeek: 1 });

export default mongoose.model<ITimetable>('Timetable', TimetableSchema);
