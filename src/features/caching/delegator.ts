import {  BoundCacheLayer, CacheLayer, CacheOptions, LogLevel } from "./caching";
import MemoryCacheLayer from "@/features/caching/memcache";
import IDBCacheLayer from "@/features/caching/IDBCache";

// const LOG_LEVEL: LogLevel = (process.env.NEXT_PUBLIC_CACHE_LOG_LEVEL as LogLevel) ?? "none";
export default class CacheDelegator implements CacheLayer {
private layers: CacheLayer[];
private logLevel: LogLevel;


constructor(layers: CacheLayer[], logLevel: LogLevel = "none") {
  this.layers = layers;
  this.logLevel = logLevel;
}

private log(level: LogLevel, msg: string, ...args: any[]) {
 
 
  if (this.logLevel === "none") return;
  if (this.logLevel === "basic" && level === "verbose") return;
  console.log(`[Cache Delegator][${level}] ${msg}`, ...args);

}

async get<T>(key: string, options?: CacheOptions): Promise<T | undefined> {
  const slice = options?.slice ?? "default";
  for (const layer of this.layers) {
    const result = await layer.get<T>(key, options);
    if (result !== undefined) {
      this.log("verbose", `${layer.constructor.name} HIT [${slice}:${key}]`);
      return result;
    }
  }
  this.log("verbose", `MISS [${slice}:${key}]`);
  return undefined;
}

async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
  const slice = options?.slice ?? "default";
  for (const layer of this.layers) {
    await layer.set(key, value, options);
    this.log("basic", `${layer.constructor.name} SET [${slice}:${key}]`);
  }
}

async delete(key: string, options?: CacheOptions): Promise<void> {
  const slice = options?.slice ?? "default";
  for (const layer of this.layers) {
    await layer.delete(key, options);
    this.log("basic", `${layer.constructor.name} DELETE [${slice}:${key}]`);
  }
}

async clear(options?: { slice?: string }): Promise<void> {
  for (const layer of this.layers) {
    await layer.clear(options);
    this.log("basic", `${layer.constructor.name} CLEAR [${options?.slice ?? "all"}]`);
  }
}

async evict(): Promise<void> {
  for (const layer of this.layers) {
    await layer.evict?.();
  }
}

bind(slice: string): BoundCacheLayer {
  return {
    get: (key, opts) => this.get(key, { ...opts, slice }),
    set: (key, value, opts) => this.set(key, value, { ...opts, slice }),
    delete: (key, opts) => this.delete(key, { ...opts, slice }),
    clear: () => this.clear({ slice }),
  };
}


public async cleanup(): Promise<void> {
  for (const layer of this.layers) {
    if ("cleanupNearExpired" in layer && typeof layer.cleanupNearExpired === "function") {
      await layer.cleanupNearExpired(); // only if supported
    }
  }
}



}

let cache: CacheDelegator | null = null;

const layers: CacheLayer[] = [];
if (typeof window !== "undefined") {
const logLevel: LogLevel = (process.env.NEXT_PUBLIC_CACHE_LOG_LEVEL as LogLevel) ?? "none";
if (process.env.NEXT_PUBLIC_DISABLE_MEMORY_CACHE !== "true") {
layers.push(new MemoryCacheLayer(logLevel));
}
if (process.env.NEXT_PUBLIC_DISABLE_IDB_CACHE !== "true") {
layers.push(new IDBCacheLayer(logLevel));
}

// Add future cache types like FileSystemCacheLayer, RedisCacheLayer here
cache = new CacheDelegator(layers, logLevel);
}

function fallbackBoundCacheLayer(): BoundCacheLayer {
return {
get: async () => undefined,
set: async () => {},
delete: async () => {},
clear: async () => {},
};
}

export const starSlice = cache?.bind("gitstars") ?? fallbackBoundCacheLayer();
export const npmSlice = cache?.bind("npm") ?? fallbackBoundCacheLayer();

export const cleanupIDBCache = cache?.cleanup.bind(cache) ?? (async () => {});
