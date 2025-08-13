// utils/dbConnect.ts
import mongoose, { Schema, model, models } from 'mongoose';



const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for credentials provider
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  image: { type: String }, // For OAuth profile images
}, { timestamps: true });

export const User = (models.User as mongoose.Model<any>) || model('User', UserSchema);

// Provide a default export compatible with existing imports
export default async function dbConnect(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }
  const uri = process.env.NEXT_PUBLIC_MONGO_URI_DEV
    || process.env.NEXT_PUBLIC_MONGO_URI
    || '';
  if (!uri) {
    throw new Error('MongoDB connection string is not configured');
  }
  await mongoose.connect(uri, {
    dbName: process.env.NEXT_PUBLIC_MONGO_DATABASE || 'basicutils',
  } as any);
  return mongoose;
}


