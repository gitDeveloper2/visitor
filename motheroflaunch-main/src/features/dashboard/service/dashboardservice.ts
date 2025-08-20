
import { connectToMongo } from '@features/shared/lib/mongoose';
import Tools from '@features/tools/models/Tools';
import { getVoteModel } from '@features/votes/models/Vote';
import { getVoteSummaryModel } from '@features/votes/models/VoteSummary';
import mongoose from 'mongoose';

export async function getUserDashboardData(userId: string) {
    await connectToMongo()
  const Vote = await getVoteModel();
  const VoteSummary = await getVoteSummaryModel();

  // 1. Fetch user tools and their IDs
  const userTools = await Tools.find({ ownerId: userId }).lean();
  const toolIds = userTools.map(t => t._id);

  // 2. Find next upcoming launch among user tools
  const now = new Date();
  const upcomingLaunch = userTools
  .filter(t => t.launchDate && t.launchDate > now)
  .sort((a, b) => {
    // Tell TS launchDate exists here:
    return (a.launchDate!.getTime() - b.launchDate!.getTime());
  })[0] || null;


  // 3. Aggregate total votes received for owned tools
  const summaries = await VoteSummary.find({ toolId: { $in: toolIds } }).lean();
  const totalVotesReceived = summaries.reduce((sum, s) => sum + s.totalVotes, 0);

  // 4. Count votes cast by user
  const votesCast = await Vote.countDocuments({ userId });

  // 5. Count tools created
  const toolsCreatedCount = userTools.length;

  // 6. Count social accounts linked (assuming you have user profile loaded)
  // For now, placeholder 0; you'll pass user profile as param or fetch separately
  const socialAccountsCount = 0;

  // 7. Recent tools launched (limit 5, ordered by createdAt desc)
  const recentTools = userTools
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // 8. Recent votes cast in last 30 days
  const recentVotesCount = await Vote.countDocuments({
    userId,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });

  // 9. Tools with zero votes
  const votedToolIds = summaries.map(s => s.toolId.toString());
  const zeroVoteToolsCount = toolIds.filter(id => !votedToolIds.includes(id.toString())).length;

  return {
    toolsCreatedCount,
    totalVotesReceived,
    votesCast,
    upcomingLaunch,
    recentTools,
    recentVotesCount,
    zeroVoteToolsCount,
    socialAccountsCount,
  };
}
