import mongoose, { Document } from "mongoose";

interface IStorageDocument extends Document {
  url: string;
  public_id: string;
  format: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const storageSchema = new mongoose.Schema<IStorageDocument>(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    duration: {
      type: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const StorageModel = mongoose.model<IStorageDocument>("Storage", storageSchema);

export default StorageModel;
