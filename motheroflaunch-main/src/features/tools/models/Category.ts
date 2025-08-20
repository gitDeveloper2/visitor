// models/Category.ts
import mongoose, { Schema, Types, model, models } from 'mongoose';

export interface ICategory {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    color?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    color: { type: String },
    description: { type: String }, // ✅ Add this
  }, { timestamps: true });
  

export default models.Category || model<ICategory>('Category', categorySchema);
