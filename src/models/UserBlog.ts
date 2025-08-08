import mongoose, { Document, Schema, model, models } from 'mongoose';

interface IUserBlog {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorEmail: string;
  isInternal: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserBlogDocument extends IUserBlog, Document {}

const userBlogSchema = new Schema<IUserBlogDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    isInternal: { type: Boolean, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const UserBlog = (mongoose.models.UserBlog as  mongoose.Model<IUserBlogDocument>)||model<IUserBlogDocument>('UserBlog', userBlogSchema);

export default UserBlog;
export type { IUserBlog, IUserBlogDocument };
