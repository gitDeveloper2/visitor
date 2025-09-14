import { redis, votingKeys } from './redis';
import { connectToDatabase } from '@/lib/mongodb';

const VOTING_DURATION_HOURS = 24; // 24-hour voting window

export interface VotingSession {
  date: string;
  startTime: Date;
  endTime: Date;
  tools: string[];
}

export async function startVotingSession(date: string, toolIds: string[]): Promise<VotingSession> {
  const redisClient = await redis;
  const sessionKey = votingKeys.activeSession(date);
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + VOTING_DURATION_HOURS * 60 * 60 * 1000);
  
  const session: VotingSession = {
    date,
    startTime,
    endTime,
    tools: toolIds,
  };

  // Start a transaction
  const multi = redisClient.multi();
  
  // Store session data
  multi.set(sessionKey, JSON.stringify({
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    tools: toolIds,
  }));
  
  // Set expiration (extra hour for flush)
  multi.expire(sessionKey, (VOTING_DURATION_HOURS * 60 * 60) + 3600);
  
  // Initialize vote counts for all tools
  toolIds.forEach(toolId => {
    multi.setnx(votingKeys.toolVotes(toolId), '0');
  });
  
  // Store active tools in a set - use global key to match voting API
  const activeToolsKey = votingKeys.activeTools(date);
  multi.sadd(activeToolsKey, ...toolIds);
  multi.expire(activeToolsKey, (VOTING_DURATION_HOURS * 60 * 60) + 3600);
  
  await multi.exec();
  
  return session;
}

export async function endVotingSession(date: string): Promise<{ success: boolean; message: string }> {
  const redisClient = await redis;
  const sessionKey = votingKeys.activeSession(date);
  const activeToolsKey = votingKeys.activeTools(date);
  
  // Get session data
  const sessionData = await redisClient.get(sessionKey);
  if (!sessionData) {
    return { success: false, message: 'No active session found' };
  }
  
  // Get all tools in this session - use global active tools key
  const globalActiveToolsKey = votingKeys.activeTools(date);
  const toolIds = await redisClient.sMembers(globalActiveToolsKey);
  if (toolIds.length === 0) {
    return { success: true, message: 'No tools in session' };
  }
  
  // Get all vote counts
  const voteCounts = await Promise.all(
    toolIds.map(async (toolId) => ({
      toolId,
      votes: parseInt(await redisClient.get(votingKeys.toolVotes(toolId)) || '0', 10)
    }))
  );
  
  // Update database
  const { db } = await connectToDatabase();
  await db.collection('userapps').bulkWrite(
    voteCounts.map(({ toolId, votes }) => ({
      updateOne: {
        filter: { _id: toolId },
        update: { 
          $inc: { 
            'stats.votes': votes,
            'stats.totalVotes': votes 
          },
          $set: { 
            votingEnded: true,
            lastVoteFlush: new Date()
          }
        }
      }
    }))
  );
  
  // Clean up
  const multi = redisClient.multi();
  
  // Delete vote counts
  voteCounts.forEach(({ toolId }) => {
    multi.del(votingKeys.toolVotes(toolId));
  });
  
  // Clean up session data
  multi.del(sessionKey, globalActiveToolsKey);
  
  await multi.exec();
  
  return { 
    success: true, 
    message: `Successfully flushed votes for ${voteCounts.length} tools` 
  };
}

export async function getActiveSession(date: string = new Date().toISOString().split('T')[0]): Promise<VotingSession | null> {
  const redisClient = await redis;
  const sessionKey = votingKeys.activeSession(date);
  
  const sessionData = await redisClient.get(sessionKey);
  if (!sessionData) return null;
  
  const data = JSON.parse(sessionData);
  return {
    date,
    startTime: new Date(data.startTime),
    endTime: new Date(data.endTime),
    tools: data.tools || []
  };
}

export async function isToolInActiveSession(toolId: string): Promise<boolean> {
  const redisClient = await redis;
  const date = new Date().toISOString().split('T')[0];
  const globalActiveToolsKey = votingKeys.activeTools(date);
  
  return redisClient.sIsMember(globalActiveToolsKey, toolId);
}

export async function getTodaysLaunchTools(): Promise<string[]> {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setUTCHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setUTCHours(23, 59, 59, 999);
  
  const { db } = await connectToDatabase();
  const tools = await db.collection('userapps').find({
    launchDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: 'approved'
  }).project({ _id: 1 }).toArray();
  
  return tools.map(tool => tool._id.toString());
}
