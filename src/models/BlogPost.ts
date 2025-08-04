import { Document, Schema, model, models } from 'mongoose';

interface IBlogPost {
  domain: string;
  slug: string;
  title: string;
  content: string;
  keywords: string;
  meta_description: string;
  canonical?: string;
  content_type: string;
  author: string;
  published: boolean;
  date: Date;
  date_updated?: Date;
}

interface IBlogPostDocument extends IBlogPost, Document {}

const blogPostSchema = new Schema<IBlogPostDocument>(
  {
    domain: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    keywords: { type: String, required: true },
    meta_description: { type: String, required: true },
    canonical: { type: String },
    content_type: { type: String, required: true },
    author: { type: String, required: true },
    published: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    date_updated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure the model is defined only once to avoid compilation errors
const BlogPost = models.BlogPost || model<IBlogPostDocument>('BlogPost', blogPostSchema);

export default BlogPost;
export type { IBlogPost, IBlogPostDocument };
