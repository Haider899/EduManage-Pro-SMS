import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  category: 'academic' | 'administrative' | 'event' | 'urgent';
  author: mongoose.Types.ObjectId;
  targetRoles: string[]; // ['student', 'teacher', 'all']
  expiresAt?: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      enum: ['academic', 'administrative', 'event', 'urgent'],
      default: 'administrative',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRoles: {
      type: [String],
      default: ['all'],
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotice>('Notice', noticeSchema);
