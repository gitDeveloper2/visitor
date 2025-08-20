import { connectToMongo } from "@features/shared/lib/mongoose";
import Tools from "@features/tools/models/Tools";
import User from "@features/users/models/User";
import { getVoteModel } from "@features/votes/models/Vote";


export async function getAdminDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
connectToMongo()
  const [totalUsers, suspendedUsers, totalTools, launchedToday, voteModel] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ suspended: true }),
    Tools.countDocuments(),
    Tools.countDocuments({ launchDate: { $eq: todayStart } }),
    getVoteModel(),
  ]);
  const votesThisWeek = await voteModel.countDocuments({
    createdAt: { $gte: weekAgo },
  });

  const [draftCount, upcomingCount, launchedCount, suspendedTools] = await Promise.all([
    Tools.countDocuments({ status: 'draft' }),
    Tools.countDocuments({ status: 'upcoming' }),
    Tools.countDocuments({ status: 'launched' }),
    Tools.countDocuments({ status: 'suspended' }),
  ]);
console.log(draftCount, upcomingCount, launchedCount, suspendedTools)
  const recentTools = await Tools.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name slug status launchDate createdAt ownerId')
    .populate('ownerId', 'name email');
console.log(recentTools)
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role suspended createdAt');
    console.log(recentUsers)

  return {
    stats: {
      totalUsers,
      suspendedUsers,
      totalTools,
      draftCount,
      upcomingCount,
      launchedCount,
      suspendedTools,
      launchedToday,
      votesThisWeek,
    },
    recentTools,
    recentUsers,
  };
}
