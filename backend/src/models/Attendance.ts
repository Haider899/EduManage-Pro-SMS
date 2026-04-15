import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks: string;
  markedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    remarks: String,
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  },
  { timestamps: true }
);

AttendanceSchema.index({ student: 1, date: 1 });
AttendanceSchema.index({ class: 1, date: 1 });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
