import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title?: string;
  class?: mongoose.Types.ObjectId;
  files: Array<{ filename: string; url?: string }>;
  uploadedBy: mongoose.Types.ObjectId;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    title: String,
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    files: [
      {
        filename: String,
        url: String,
      },
    ],
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMaterial>('Material', MaterialSchema);
