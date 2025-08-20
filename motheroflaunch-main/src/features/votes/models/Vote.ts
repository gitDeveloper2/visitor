// models/vote.ts
import { getVoteConnection } from '@features/shared/lib/mongoose';
import { Schema, Model, Document } from 'mongoose';


interface Vote extends Document {
  userId: string;
  toolId: string;
  createdAt: Date;
}

const voteSchema = new Schema<Vote>(
  {
    userId: { type: String, required: true },
    toolId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

let cachedModel: Model<Vote> | null = null;

export async function getVoteModel(): Promise<Model<Vote>> {
  if (cachedModel) return cachedModel;

  const conn = await getVoteConnection();
  cachedModel = conn.models.Vote || conn.model<Vote>('Vote', voteSchema);
  return cachedModel;
}
