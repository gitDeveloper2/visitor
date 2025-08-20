import mongoose from 'mongoose';
import { IVoteResponse } from '@/types/IVoteResponse'; // Assuming you'll create this type
import { getVoteSummaryModel } from '../models/VoteSummary';
import { getVoteModel } from '../models/Vote';
import { getAppModel } from '@/models/App'; // Assuming this is your App/Tool model path


export async function getUserUpvotedTools(userId: string) {
  const Vote = await getVoteModel();

  const votes = await Vote.find({ userId }).select('toolId');

  const toolIds = votes.map((v) => v.toolId);
  if (toolIds.length === 0) return [];

  const App = getAppModel();
  const tools = await App.find({ _id: { $in: toolIds } }).sort({ createdAt: -1 }).lean();
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
export async function toggleVote(toolId: string, userId: string): Promise<IVoteResponse> {
  const Vote = await getVoteModel();
  const VoteSummary = await getVoteSummaryModel();
  const _toolId = new mongoose.Types.ObjectId(toolId);

  const existingVote = await Vote.findOne({ toolId: _toolId, userId });

  if (existingVote) {
    // UNVOTE
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
    // VOTE
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