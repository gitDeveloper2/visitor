import Redis from 'ioredis';
import { env } from './env'; // or wherever your env loader is

const globalForRedis = globalThis as unknown as {
  __redis__: Redis | undefined;
};

// Only create one Redis connection per runtime
const redis =
  globalForRedis.__redis__ ?? new Redis(env.REDIS_URL);

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.__redis__ = redis;
}

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redis;
