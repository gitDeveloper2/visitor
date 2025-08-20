import mongoose from 'mongoose';
import { VoteResponse } from '@features/types';
import { getVoteSummaryModel } from '../models/VoteSummary';
import { getVoteModel } from '../models/Vote';
import Tools from '@features/tools/models/Tools';



export async function getUserUpvotedTools(userId: string) {
  const Vote = await getVoteModel();

  const votes = await Vote.find({ userId }).select('toolId');

  const toolIds = votes.map((v) => v.toolId);
  if (toolIds.length === 0) return [];

  const tools = await Tools.find({ _id: { $in: toolIds } }).sort({ createdAt: -1 }).lean();
  return tools;
}
/**
 * Get total vote count for a tool.
 */
export async function getVoteCount(toolId: string): Promise<number> {
  const VoteSummary = await getVoteSummaryModel();
  const _toolId = new mongoose.Types.ObjectId(toolId);

  const summary = await VoteSummary.findOne({ toolId: _toolId }).lean();
  return summary?.totalVotes ?? 0;
}

/**
 * Toggle vote for a user on a tool.
 */
export async function toggleVote(toolId: string, userId: string): Promise<VoteResponse> {
  const Vote = await getVoteModel();
  const VoteSummary = await getVoteSummaryModel();
  const _toolId = new mongoose.Types.ObjectId(toolId);

  const existingVote = await Vote.findOne({ toolId: _toolId, userId });

  if (existingVote) {
    // ❌ Unlike
    await Vote.deleteOne({ _id: existingVote._id });

    const updatedSummary = await VoteSummary.findOneAndUpdate(
      { toolId: _toolId },
      { $inc: { totalVotes: -1 } },
      { upsert: true, new: true }
    );

    return {
      success: true,
      votes: updatedSummary?.totalVotes ?? 0,
      alreadyVoted: false,
    };
  } else {
    // ✅ Like
    await Vote.create({ toolId: _toolId, userId });

    const updatedSummary = await VoteSummary.findOneAndUpdate(
      { toolId: _toolId },
      { $inc: { totalVotes: 1 } },
      { upsert: true, new: true }
    );

    return {
      success: true,
      votes: updatedSummary?.totalVotes ?? 1,
      alreadyVoted: true,
    };
  }
}
