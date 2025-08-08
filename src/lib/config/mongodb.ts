// utils/dbConnect.ts
import mongoose from 'mongoose';
import { Schema, model, models } from 'mongoose';



const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for credentials provider
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  image: { type: String }, // For OAuth profile images
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);


