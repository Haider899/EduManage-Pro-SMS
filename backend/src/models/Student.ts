import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  class: string;
  section: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  admissionDate: Date;
  photo: string;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    rollNumber: {
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
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    address: String,
    city: String,
    state: String,
    pinCode: String,
    parentName: {
      type: String,
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    parentEmail: {
      type: String,
      lowercase: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    photo: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', StudentSchema);
