// lib/models/Blog.ts
import mongoose, { Schema, Document, Model } from 'mongoose';


export interface BlogDoc extends Document {
  title: string;
  slug: string;
  content: unknown; // Lexical JSON – you can make this more specific later if needed
  // authorId?: mongoose.Types.ObjectId;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<BlogDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: Schema.Types.Mixed, required: true },
    // authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Blog: Model<BlogDoc> = mongoose.models.Blog || mongoose.model<BlogDoc>('Blog', BlogSchema);
