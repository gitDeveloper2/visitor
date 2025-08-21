import Redis from 'ioredis';

type RedisLike = {
  get: (key: string) => Promise<string | null>;
  set: (...args: any[]) => Promise<any>;
  incr: (key: string) => Promise<number>;
  decr: (key: string) => Promise<number>;
  mget: (...keys: string[]) => Promise<(string | null)[]>;
  sadd?: (key: string, ...members: string[]) => Promise<number>;
  srem?: (key: string, ...members: string[]) => Promise<number>;
};

const createStubRedis = (): RedisLike => {
  return {
    async get() { return null; },
    async set() { return 'OK'; },
    async incr() { return 1; },
    async decr() { return 0; },
    async mget(...keys: string[]) { return keys.map(() => null); },
    async sadd() { return 0; },
    async srem() { return 0; },
  };
};

const rawRedisUrl = (process.env.REDIS_URL || '').trim();
const isLikelyValidRedisUrl = /^rediss?:\/\//i.test(rawRedisUrl);
const hasRedisUrl = Boolean(rawRedisUrl && isLikelyValidRedisUrl);

const globalForRedis = globalThis as unknown as {
  __redis__: RedisLike | undefined;
};

function createRedisClient(): RedisLike {
  // If REDIS_URL is missing or malformed, avoid instantiating ioredis
  if (!hasRedisUrl) {
    return createStubRedis();
  }

  const client = new Redis(rawRedisUrl, {
    // Prevent eager connection attempts during build/startup
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: true,
  } as any);

  // Best-effort connect on first command; listeners for observability
  client.on('connect', () => {
    console.log('✓ Connected to Redis');
  });
  client.on('error', (err) => {
    console.error('✗ Redis connection error:', err);
  });

  return client as unknown as RedisLike;
}

const redis: RedisLike = globalForRedis.__redis__ ?? createRedisClient();
if (process.env.NODE_ENV !== 'production') {
  globalForRedis.__redis__ = redis;
}

export default redis;
