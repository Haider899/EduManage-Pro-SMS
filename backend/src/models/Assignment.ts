import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  class: mongoose.Types.ObjectId;
  due: Date;
  description?: string;
  attachments?: Array<{ filename: string; url?: string }>;
  createdBy: mongoose.Types.ObjectId;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    due: { type: Date },
    description: { type: String },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
