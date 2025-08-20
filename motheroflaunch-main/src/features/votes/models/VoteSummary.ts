// models/voteSummary.ts
import { getVoteConnection } from '@features/shared/lib/mongoose';
import mongoose, { Schema, model, Connection } from 'mongoose';

export interface IVoteSummary {
  toolId: mongoose.Types.ObjectId;
  totalVotes: number;
}

const voteSummarySchema = new Schema<IVoteSummary>({
  toolId: { type: Schema.Types.ObjectId, required: true, unique: true },
  totalVotes: { type: Number, required: true, default: 0 },
});

let VoteSummaryModel: mongoose.Model<IVoteSummary>;

export async function getVoteSummaryModel(): Promise<mongoose.Model<IVoteSummary>> {
  const conn = await getVoteConnection();

  // Prevent overwrite in dev with HMR
  return VoteSummaryModel ||=
    (conn.models.VoteSummary as mongoose.Model<IVoteSummary>) ||
    conn.model<IVoteSummary>('VoteSummary', voteSummarySchema);
}
