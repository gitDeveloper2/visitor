import { kvGet, kvSet, kvGetOrSet, kvDel, kvDelByPrefix } from './kv';
import { CachePolicy } from './policy';
import { stableStringify, simpleHash, hashObject } from './hash';

const LOG = process.env.NEXT_PUBLIC_CACHE_LOG_LEVEL || process.env.CACHE_LOG_LEVEL || '';
const logBasic = LOG === 'basic' || LOG === 'verbose';
const logVerbose = LOG === 'verbose';

async function loggedGet<T>(key: string): Promise<T | null> {
	const value = await kvGet<T>(key);
	if (logBasic) console.log(`[Cache:get] ${key} -> ${value === null ? 'MISS' : 'HIT'}`);
	return value;
}

async function loggedSet<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
	const ok = await kvSet(key, value as any, ttlSeconds);
	if (logVerbose) console.log(`[Cache:set] ${key} ttl=${ttlSeconds ?? 'none'} ok=${ok}`);
	return ok;
}

async function loggedGetOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
	const cached = await loggedGet<T>(key);
	if (cached !== null) return cached as T;
	const fresh = await fetcher();
	// best-effort
	loggedSet(key, fresh as any, ttlSeconds).catch(() => {});
	if (logBasic) console.log(`[Cache:fill] ${key} ttl=${ttlSeconds}`);
	return fresh;
}

async function loggedDel(key: string): Promise<boolean> {
	const ok = await kvDel(key);
	if (logVerbose) console.log(`[Cache:del] ${key} ok=${ok}`);
	return ok;
}

async function loggedDelByPrefix(prefix: string): Promise<void> {
	if (logVerbose) console.log(`[Cache:delByPrefix] ${prefix}*`);
	await kvDelByPrefix(prefix);
}

export const Cache = {
	get: loggedGet,
	set: loggedSet,
	getOrSet: loggedGetOrSet,
	del: loggedDel,
	delByPrefix: loggedDelByPrefix,
	keys: CachePolicy.keys,
	hash: { stableStringify, simpleHash, hashObject },
};

export { CachePolicy } from './policy';

