import type { Redis } from '@upstash/redis';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function createClient(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    // Lazy import to avoid build-time issues
    const { Redis } = require('@upstash/redis');
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const client = createClient();

export async function kvGet<T extends JsonValue>(key: string): Promise<T | null> {
  if (!client) return null;
  try {
    const value = await (client as any).get(key);
    return (value as T | null) ?? null;
  } catch {
    return null;
  }
}

export async function kvSet<T extends JsonValue>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  if (!client) return false;
  try {
    if (ttlSeconds && Number.isFinite(ttlSeconds)) {
      await (client as any).set(key, value, { ex: ttlSeconds });
    } else {
      await (client as any).set(key, value);
    }
    return true;
  } catch {
    return false;
  }
}

export async function kvGetOrSet<T extends JsonValue>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await kvGet<T>(key);
  if (cached !== null) return cached;
  const value = await fetcher();
  // Best-effort set; ignore failures
  kvSet(key, value, ttlSeconds).catch(() => {});
  return value;
}

export async function kvDel(key: string): Promise<boolean> {
  if (!client) return false;
  try {
    await (client as any).del(key);
    return true;
  } catch {
    return false;
  }
}

export async function kvDelByPrefix(prefix: string): Promise<void> {
  if (!client) return;
  try {
    let cursor = 0;
    // Use SCAN to avoid KEYS on large datasets
    do {
      const res = await (client as any).scan(cursor, { match: `${prefix}*`, count: 1000 });
      cursor = res[0];
      const keys: string[] = res[1] || [];
      if (keys.length > 0) {
        await (client as any).del(...keys);
      }
    } while (cursor !== 0);
  } catch {
    // ignore
  }
}

export const kv = {
  get: kvGet,
  set: kvSet,
  getOrSet: kvGetOrSet,
  del: kvDel,
  delByPrefix: kvDelByPrefix,
  // Namespaces for keys
  keys: {
    blogIndex: 'blog:index:v1',
    blogCategory: (slug: string) => `blog:category:v1:${slug}`,
    blogTag: (slug: string) => `blog:tag:v1:${slug}`,
    blogPost: (slug: string) => `blog:post:v1:${slug}`,
    launchIndex: 'launch:index:v1',
    launchCategory: (slug: string) => `launch:category:v1:${slug}`,
    app: (slugOrId: string) => `app:v1:${slugOrId}`,
    categories: (type?: string) => `categories:v1:${type || 'both'}`,
  },
};

