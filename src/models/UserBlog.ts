import mongoose, { Document, Schema, model, models } from 'mongoose';

interface IUserBlog {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorEmail: string;
  // Additional fields from forms
  author: string;
  role: string;
  authorBio: string;
  founderUrl: string;
  isInternal: boolean;
  isFounderStory: boolean;
  status: 'pending' | 'approved' | 'rejected';
  readTime?: number;
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
    // Additional fields from forms
    author: { type: String, required: true },
    role: { type: String, default: 'Author' },
    authorBio: { type: String, default: '' },
    founderUrl: { type: String, default: '' },
    isInternal: { type: Boolean, required: true },
    isFounderStory: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    readTime: { type: Number },
  },
  { timestamps: true }
);

const UserBlog = (mongoose.models.UserBlog as  mongoose.Model<IUserBlogDocument>)||model<IUserBlogDocument>('UserBlog', userBlogSchema);

export default UserBlog;
export type { IUserBlog, IUserBlogDocument };
