import mongoose, { Schema, Document } from 'mongoose';

export interface IHR extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joiningDate: Date;
  address: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const HRSchema = new Schema<IHR>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IHR>('HR', HRSchema);
