import mongoose, { model } from "mongoose";
import { BlogAPIType, BlogMongooseType } from "../schema/schema";
import { IUser } from "@features/users/models/User";
import '@features/users/models/User';


const BlogSchema = new mongoose.Schema<BlogMongooseType>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: {
    type: String,
    required: function () {
      return this.status === 'published';
    },
  },
  
  excerpt: { type: String },

  coverImage: {
    url: String,
    public_id: String,
  },

  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
  tags: [String],

  featured: { type: Boolean, default: false },
  paidFeature: { type: Boolean, default: false },

  // ✅ status field instead of isDraft/published
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },

  // ✅ for editing published blog
  originalBlogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },

  // ✅ optional stepper tracking
  step: Number,

  suspended: { type: Boolean, default: false },


}, { timestamps: true });

  
  export default (mongoose.models.Blog as mongoose.Model<BlogMongooseType>) || model<BlogMongooseType>('Blog', BlogSchema);
  // export default (mongoose.models.User as mongoose.Model<IUser>) || model<IUser>('User', userSchema);
  export interface BlogWithAuthor extends Omit<BlogMongooseType, 'author'> {
    author: IUser;
  }