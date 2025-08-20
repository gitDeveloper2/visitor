import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToMongo } from '@features/shared/lib/mongoose';
import Tools from '@features/tools/models/Tools';
import { getCachedVoteBatch } from '@features/votes/service/redisSummaries';
import { auth } from '../../../../../auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  // Authenticate user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  console.log('userId:', userId);

  // Parse query params
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get('size') || '10');
  const cursor = searchParams.get('cursor') || undefined;
  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || undefined;
  const rawPeriod = searchParams.get('period');
  const period = rawPeriod === 'daily' || rawPeriod === 'weekly' || rawPeriod === 'monthly'
    ? rawPeriod
    : undefined;

  // Filter tools by ownerId and optional status, query, period
  // We'll extend getPaginatedTools or create a new service that supports filtering by ownerId

  // Temporary: create a custom filter here because getPaginatedTools doesn't filter by ownerId yet

  const filters: any = { ownerId: new mongoose.Types.ObjectId(userId) };

  if (query.trim()) {
    filters.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
  }

  if (status) {
    filters.status = status;
  }

  if (period) {
    const now = new Date();
    let start: Date | null = null;

    if (period === 'daily') {
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Sunday start
      start.setHours(0, 0, 0, 0);
    } else if (period === 'monthly') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (start) {
      filters.createdAt = { ...(filters.createdAt || {}), $gte: start };
    }
  }

  if (cursor) {
    filters.createdAt = { ...(filters.createdAt || {}), $lt: new Date(cursor) };
  }

  // Connect to Mongo and query
  await connectToMongo();

  const tools = await Tools.find(filters)
    .sort({ createdAt: -1 })
    .limit(size + 1)
    .lean();

  const hasNextPage = tools.length > size;
  const paginated = tools.slice(0, size);

  const nextCursor = hasNextPage ? paginated[size - 1].createdAt.toISOString() : null;

  // Fetch vote counts in batch from your redis / mongo vote summary system
  const toolIds = paginated.map((tool) => tool._id.toString());
  const counts = await getCachedVoteBatch(toolIds) || {};

  // Fallback if some IDs missing in cache: set to tool.stats.votes
  for (const tool of paginated) {
    if (!(tool._id.toString() in counts)) {
      counts[tool._id.toString()] = tool.stats?.votes || 0;
    }
  }

  // Return response with tools and vote counts
  return NextResponse.json({
    success: true,
    data: paginated.map((tool) => ({
      ...tool,
      _id: tool._id.toString(),
      votes: counts[tool._id.toString()] || 0,
    })),
    size,
    nextCursor,
    hasNextPage,
  });
}
