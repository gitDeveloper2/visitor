import { Document, Schema, model, models } from 'mongoose';

interface IApp {
  name: string;
  slug: string; // Added slug field
  tagline?: string;
  description: string;
  fullDescription?: string;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  authorBio?: string;
  badges: string[];
  status: 'pending' | 'approved' | 'rejected';
  // App details
  category?: string;
  techStack?: string[];
  pricing?: string;
  website?: string;
  github?: string;
  externalUrl?: string;
  // Features and media
  features?: string[];
  gallery?: string[];
  tags?: string[];
  // Stats
  stats?: {
    likes: number;
    views: number;
    installs: number;
  };
  // Verification
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IAppDocument extends IApp, Document {}

const appSchema = new Schema<IAppDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true }, // Added slug with index
    tagline: { type: String },
    description: { type: String, required: true },
    fullDescription: { type: String },
    author: { type: String, required: true },
    authorName: { type: String },
    authorAvatar: { type: String },
    authorBio: { type: String },
    badges: { type: [String], default: [] },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    // App details
    category: { type: String },
    techStack: { type: [String], default: [] },
    pricing: { type: String },
    website: { type: String },
    github: { type: String },
    externalUrl: { type: String },
    // Features and media
    features: { type: [String], default: [] },
    gallery: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    // Stats
    stats: {
      likes: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      installs: { type: Number, default: 0 },
    },
    // Verification
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create compound index for better query performance
appSchema.index({ slug: 1, status: 1 });

const App = models.App || model<IAppDocument>('App', appSchema);

export default App;
export type { IApp, IAppDocument };
