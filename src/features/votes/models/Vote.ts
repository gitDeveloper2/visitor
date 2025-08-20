// models/Vote.ts
import { getVoteConnection } from '@/lib/config/mongodb';
import { Schema, Model, Document, Types } from 'mongoose';


export interface IVote extends Document {
  userId: string;
  toolId: Types.ObjectId;
  createdAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    userId: { type: String, required: true },
    toolId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

let cachedVoteModel: Model<IVote> | null = null;

export async function getVoteModel(): Promise<Model<IVote>> {
  if (cachedVoteModel) return cachedVoteModel;

  const conn = await getVoteConnection();
  cachedVoteModel = conn.models.Vote || conn.model<IVote>('Vote', voteSchema);
  return cachedVoteModel;
}