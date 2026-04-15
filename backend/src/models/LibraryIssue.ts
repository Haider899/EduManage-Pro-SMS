import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryIssue extends Document {
  student: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'issued' | 'returned' | 'overdue';
  fineAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryIssueSchema = new Schema<ILibraryIssue>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'LibraryBook',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: Date,
    status: {
      type: String,
      enum: ['issued', 'returned', 'overdue'],
      default: 'issued',
    },
    fineAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model<ILibraryIssue>('LibraryIssue', LibraryIssueSchema);
