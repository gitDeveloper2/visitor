import mongoose, { Schema, Types, model, models } from 'mongoose';
import { ISocialAccount } from '../schemas/Use';

const socialAccountSchema = new Schema<ISocialAccount>({
  type: { type: String, required: true },
  username: { type: String },
  url: { type: String },
}, { _id: false }); // no separate _id for subdocs
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password?: string; // ← Needed for credentials login
  avatarUrl?: string;
  bio?: string;
  websiteUrl?: string;
  githubUsername?: string;
  twitterUsername?: string;
  pro: boolean;
  role: 'user' | 'creator' | 'admin';
  suspended: boolean;
  socialAccounts?: ISocialAccount[];
  createdAt: Date;
  updatedAt?: Date;
}


const userSchema = new Schema<IUser>({
  socialAccounts: [socialAccountSchema], // array of social accounts
  email:           { type: String, required: true, unique: true },
  name:            { type: String, required: true },
  password:        { type: String }, // ← Optional for OAuth users
  avatarUrl:       { type: String },
  bio:             { type: String },
  websiteUrl:      { type: String },
  githubUsername:  { type: String },
  twitterUsername: { type: String },
  pro:             { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user',
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  
}, {
  timestamps: true, // adds createdAt and updatedAt
  collection:"user"
});

export default (mongoose.models.User as mongoose.Model<IUser>) || model<IUser>('User', userSchema,"user");
