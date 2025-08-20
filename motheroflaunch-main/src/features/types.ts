import mongoose, { Types } from 'mongoose';

export type VoteInput = {
  toolId: string;
  userId: string;
};

export type VoteResponse = {
  success: boolean;
  votes: number;
  alreadyVoted?: boolean;
};
export interface VoteDocument extends Document {
    toolId: mongoose.Types.ObjectId;
    userId: string;
    votedAt: Date;
  }
  export interface VoteSummaryDocument extends Document {
    toolId: Types.ObjectId;
    totalVotes: number;
  }
  