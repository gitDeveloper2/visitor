import mongoose, { Document, Schema, model, models } from 'mongoose';

interface IUserBlog {
  title: string;
  slug: string; // Added slug field
  content: string;
  category: string; // Main category (required)
  subcategories: string[]; // Optional subcategories (replaces tags)
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
    slug: { type: String, required: true, unique: true, index: true }, // Added slug with index
    content: { type: String, required: true },
    category: { type: String, required: true },
    subcategories: { type: [String], default: [] },
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

// Create a compound index for better query performance
userBlogSchema.index({ slug: 1, status: 1 });

const UserBlog = (mongoose.models.UserBlog as  mongoose.Model<IUserBlogDocument>)||model<IUserBlogDocument>('UserBlog', userBlogSchema);

export default UserBlog;
export type { IUserBlog, IUserBlogDocument };
