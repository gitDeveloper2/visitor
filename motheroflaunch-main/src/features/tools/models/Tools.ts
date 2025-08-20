import mongoose, { Types, Schema, model, models } from 'mongoose';
import { ICategory } from './Category';
import { IUser } from '@features/users/models/User';

// Subdocument schema for stats
const statsSchema = new Schema({
  views:         { type: Number, default: 0 },
  clicks:        { type: Number, default: 0 },
  votes:         { type: Number, default: 0 },
  appearances:   { type: Number, default: 0 },
  featuredLists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
}, { _id: false });

// Interface for Tool
export interface ITool {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  websiteUrl: string;
  logo: {
    url: string;
    public_id: string;
  };
  screenshots?: {
    url: string;
    public_id: string;
  }[];
  category?: Types.ObjectId;
  tags?: string;
  platforms?: string[];
  ownerId: Types.ObjectId;
  stats: {
    views: number;
    clicks: number;
    votes: number;
    appearances: number;
    featuredLists: Types.ObjectId[];
  };
  votingFlushed: boolean;
  votingDurationHours?: number;
  status?: 'beta' | 'upcoming' | 'launched' | 'draft' | 'suspended';
  launchDate?: Date;
  updatedAt?: Date;
  createdAt: Date;

  // ✅ NEW FIELDS
  pricing?: {
    name: string;
    price: string;
    features: string[];
    isFree?: boolean;
    highlight?: boolean;
  }[];
  features?: {
    title: string;
    description?: string;
  }[];
  creators?: {
    name: string;
    avatarUrl: string;
    headline?: string;
    bio?: string;
    githubUsername?: string;
    twitterUsername?: string;
    websiteUrl?: string;
  }[];
}

export type UITool = Omit<ITool, '_id' | 'category'> & {
  _id: string;
  category?: ICategory | Types.ObjectId;
  ownerId?:IUser | Types.ObjectId;
};


// Main schema
const toolSchema = new Schema<ITool>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: { type: String },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  logo: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  screenshots: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      }
    ],
    default: [],
  },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: { type: String },
  platforms: { type: [String], default: [] },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stats: { type: statsSchema, default: () => ({}) },
  votingFlushed: { type: Boolean, default: false },
  votingDurationHours: { type: Number, default: 24 },
  status: { type: String, enum: ["beta", "draft", "upcoming", "launched", "suspended"], default: 'draft' },
  launchDate: { type: Date },

  // ✅ NEW
  pricing: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: String, required: true },
        features: { type: [String], required: true },
        isFree: { type: Boolean, default: false },
        highlight: { type: Boolean, default: false },
      }
    ],
    default: [],
  },

  features: {
    type: [
      {
        title: { type: String, required: true },
        description: { type: String },
      }
    ],
    default: [],
  },

  creators: {
    type: [
      {
        name: { type: String, required: true },
        avatarUrl: { type: String, required: true },
        headline: { type: String },
        bio: { type: String },
        githubUsername: { type: String },
        twitterUsername: { type: String },
        websiteUrl: { type: String },
      }
    ],
    default: [],
  },
}, {
  timestamps: true,

});


// Export model
export default (mongoose.models.Tool as mongoose.Model<ITool>) || model<ITool>('Tool', toolSchema);
