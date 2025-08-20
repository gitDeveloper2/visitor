import { NextResponse } from 'next/server';
import { getVoteSummaryModel } from '@/features/votes/models/VoteSummary';
import { getCachedVoteBatch, setCachedVoteBatch } from '@/features/votes/service/redisSummaries';

export async function GET(req: Request) {
  try {
    // Get all vote summaries from the database
    const VoteSummary = await getVoteSummaryModel();
    const summaries = await VoteSummary.find({}).lean();

    // Convert to the expected format: Record<string, number>
    const votes: Record<string, number> = {};
    for (const summary of summaries) {
      votes[summary.toolId.toString()] = summary.totalVotes;
    }

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching all votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
} 