// utils/dbConnect.ts
import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI_DEV || 'mongodb://localhost:27017/your_database_name');
};

export default dbConnect;
