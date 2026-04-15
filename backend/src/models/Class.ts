import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  classNumber: number;
  section: string;
  capacity: number;
  classTeacher: mongoose.Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
    },
    classNumber: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<IClass>('Class', ClassSchema);
