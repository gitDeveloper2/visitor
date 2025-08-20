import redis from "../lib/redis";


export async function acquireLock(key: string, ttl = 3000): Promise<boolean> {
  return await redis.set(key, "locked", "PX", ttl, "NX") !== null;
}

export async function releaseLock(key: string): Promise<void> {
  await redis.del(key);
}
