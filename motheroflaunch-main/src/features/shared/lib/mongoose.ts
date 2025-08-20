// lib/mongoose.ts
import mongoose, { Connection } from 'mongoose';
import { env } from './env';

const MONGODB_URI = env.MONGODB_URI;
const DATABASE=env.MONGODB_DATABASE;

const VOTE_DB_URI = env.MONGODB_URI_VOTES;
const VOTE_DB_NAME = env.MONGODB_DATABASE_VOTES;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI not found in environment variables');
}

export async function connectToMongo() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DATABASE, // optional
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}



let voteConnection: mongoose.Connection | null = null;

export async function getVoteConnection(): Promise<mongoose.Connection> {
  if (voteConnection && voteConnection.readyState === 1) return voteConnection;

  try {
    voteConnection = mongoose.createConnection(VOTE_DB_URI, {
      dbName: VOTE_DB_NAME,
    });

    voteConnection.on('connected', () => {
      console.log('✅ Connected to votes MongoDB');
    });

    voteConnection.on('error', (err) => {
      console.error('❌ Votes DB connection error:', err);
    });

    // Wait for the connection to be established
    await voteConnection.asPromise();

    return voteConnection;
  } catch (err) {
    console.error('❌ Failed to connect to votes MongoDB:', err);
    throw err;
  }
}
