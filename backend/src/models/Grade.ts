import mongoose, { Schema, Document } from 'mongoose';

export interface IGrade extends Document {
  student: mongoose.Types.ObjectId;
  subject: string;
  class: mongoose.Types.ObjectId;
  semester: string;
  term: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  remarks: string;
  basedOn: 'test' | 'exam' | 'practical' | 'assignment';
  createdAt: Date;
  updatedAt: Date;
}

const GradeSchema = new Schema<IGrade>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    remarks: String,
    basedOn: {
      type: String,
      enum: ['test', 'exam', 'practical', 'assignment'],
    },
  },
  { timestamps: true }
);

GradeSchema.index({ student: 1, subject: 1 });
GradeSchema.index({ class: 1, semester: 1 });

export default mongoose.model<IGrade>('Grade', GradeSchema);
