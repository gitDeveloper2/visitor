import redis from "@features/shared/lib/redis";

const summaryKey = (toolId: string) => `vote:summary:${toolId}`;

/**
 * Get vote count for a tool from Redis.
 * If not found, return null (caller can fall back to DB).
 */
export async function getVoteCount(toolId: string): Promise<number | null> {
  const value = await redis.get(summaryKey(toolId));
  return value !== null ? parseInt(value, 10) : null;
}

/**
 * Set vote count for a tool in Redis.
 */
export async function setVoteCount(toolId: string, count: number): Promise<void> {
  await redis.set(summaryKey(toolId), count);
}

/**
 * Increment vote count for a tool in Redis.
 * Returns the new value.
 */
export async function incrementVoteCount(toolId: string): Promise<number> {
  return await redis.incr(summaryKey(toolId));
}

/**
 * Decrement vote count for a tool in Redis.
 * Returns the new value.
 */
export async function decrementVoteCount(toolId: string): Promise<number> {
  return await redis.decr(summaryKey(toolId));
}

/**
 * Get multiple vote counts at once (for listing pages).
 */
export async function getVoteCounts(toolIds: string[]): Promise<Record<string, number | null>> {
  const keys = toolIds.map(summaryKey);
  const results = await redis.mget(...keys);

  return toolIds.reduce((acc, id, index) => {
    const val = results[index];
    acc[id] = val !== null ? parseInt(val, 10) : null;
    return acc;
  }, {} as Record<string, number | null>);
}


const batchCacheKey = (toolIds: string[]) => `vote:batch:${toolIds.sort().join(',')}`;

export async function getCachedVoteBatch(toolIds: string[]): Promise<Record<string, number> | null> {
  const key = batchCacheKey(toolIds);
  const json = await redis.get(key);
  return json ? JSON.parse(json) : null;
}

export async function setCachedVoteBatch(toolIds: string[], counts: Record<string, number>) {
  const key = batchCacheKey(toolIds);
  await redis.set(key, JSON.stringify(counts), 'EX', 600); // 10 minutes
}
