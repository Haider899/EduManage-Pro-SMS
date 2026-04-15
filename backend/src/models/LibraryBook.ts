import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryBook extends Document {
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  description: string;
  publishedYear: number;
  publisher: string;
  price: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryBookSchema = new Schema<ILibraryBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
    description: String,
    publishedYear: Number,
    publisher: String,
    price: Number,
    location: String,
  },
  { timestamps: true }
);

export default mongoose.model<ILibraryBook>('LibraryBook', LibraryBookSchema);
