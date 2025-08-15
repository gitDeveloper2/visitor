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
  // New verification fields for free apps
  verificationStatus?: 'pending' | 'verified' | 'failed' | 'not_required';
  verificationUrl?: string;
  verificationSubmittedAt?: Date;
  verificationCheckedAt?: Date;
  verificationAttempts?: number;
  verificationBadgeHtml?: string;
  requiresVerification?: boolean; // true for free apps
  
  // Badge assignment fields for consistency
  verificationBadgeText?: string; // The specific text assigned to this app
  verificationBadgeClass?: string; // The specific CSS class assigned to this app
  verificationBadgeVariations?: string[]; // All HTML variations with consistent text
  verificationBadgeTextPool?: string[]; // Available text variations for this app
  verificationBadgeClassPool?: string[]; // Available CSS class variations for this app
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
    // New verification fields for free apps
    verificationStatus: { 
      type: String, 
      enum: ['pending', 'verified', 'failed', 'not_required'], 
      default: 'not_required' 
    },
    verificationUrl: { type: String },
    verificationSubmittedAt: { type: Date },
    verificationCheckedAt: { type: Date },
    verificationAttempts: { type: Number, default: 0 },
    verificationBadgeHtml: { type: String },
    requiresVerification: { type: Boolean, default: false },
    
    // Badge assignment fields for consistency
    verificationBadgeText: { type: String },
    verificationBadgeClass: { type: String },
    verificationBadgeVariations: { type: [String], default: [] },
    verificationBadgeTextPool: { type: [String], default: [] },
    verificationBadgeClassPool: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Create compound index for better query performance
appSchema.index({ slug: 1, status: 1 });
appSchema.index({ verificationStatus: 1, requiresVerification: 1 });

const App = models.App || model<IAppDocument>('App', appSchema);

export default App;
export type { IApp, IAppDocument };
