import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  qualification: string;
  experience: number;
  specialization: string[];
  address: string;
  city: string;
  state: string;
  pinCode: string;
  joiningDate: Date;
  salary: number;
  photo: string;
  status: 'active' | 'inactive' | 'on-leave';
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
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
      default: '000-000-0000',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    qualification: {
      type: String,
      default: 'Not Specified',
    },
    experience: {
      type: Number,
      default: 0,
    },
    specialization: [String],
    address: String,
    city: String,
    state: String,
    pinCode: String,
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      default: 0,
    },
    photo: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);
