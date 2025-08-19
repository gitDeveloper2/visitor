type CacheEntry<T> = {
    value: T;
    expiresAt: number;
  };
  
  type LogLevel = "none" | "basic" | "verbose";
  const LOG_LEVEL: LogLevel = (process.env.NEXT_PUBLIC_CACHE_LOG_LEVEL as LogLevel) ?? "none";
  
  function log(level: LogLevel, msg: string, ...args: any[]) {
    if (LOG_LEVEL === "none") return;
    if (LOG_LEVEL === "basic" && level === "verbose") return;
    // console.log(`[Cache][${level}] ${msg}`, ...args);
  }
  
  class SliceCache<T> {
    private data: Map<string, Map<string, CacheEntry<T>>> = new Map();
    private defaultTtlMs = 3 * 60 * 60 * 1000;
  
    set(slice: string, id: string, value: T, ttlMs?: number): void {
      const ttl = ttlMs ?? this.defaultTtlMs;
      const entry = { value, expiresAt: Date.now() + ttl };
      if (!this.data.has(slice)) this.data.set(slice, new Map());
      this.data.get(slice)!.set(id, entry);
      log("basic", `Set cache [${slice}:${id}] (ttl ${ttl}ms)`);
    }
  
    get(slice: string, id: string): T | undefined {
      const entry = this.data.get(slice)?.get(id);
      if (!entry) {
        log("verbose", `Cache miss [${slice}:${id}]`);
        return undefined;
      }
      if (entry.expiresAt < Date.now()) {
        this.data.get(slice)!.delete(id);
        log("basic", `Cache expired [${slice}:${id}]`);
        return undefined;
      }
      log("verbose", `Cache hit [${slice}:${id}]`);
      return entry.value;
    }
  
    async getOrSet(
      slice: string,
      id: string,
      fetcher: () => Promise<T>,
      ttlMs?: number
    ): Promise<T> {
      const cached = this.get(slice, id);
      if (cached !== undefined) return cached;
  
      const fresh = await fetcher();
      this.set(slice, id, fresh, ttlMs);
      return fresh;
    }
  
    clear(slice: string, id?: string): void {
      if (!this.data.has(slice)) return;
      if (id) {
        this.data.get(slice)!.delete(id);
        log("basic", `Cleared cache [${slice}:${id}]`);
      } else {
        this.data.delete(slice);
        log("basic", `Cleared entire slice [${slice}]`);
      }
    }
  
    bind(slice: string) {
      return {
        set: (id: string, value: T, ttlMs?: number) => this.set(slice, id, value, ttlMs),
        get: (id: string) => this.get(slice, id),
        getOrSet: (id: string, fetcher: () => Promise<T>, ttlMs?: number) =>
          this.getOrSet(slice, id, fetcher, ttlMs),
        clear: (id?: string) => this.clear(slice, id),
      };
    }
  }
  
  const globalCache = new SliceCache<any>();
  
  export const npmHistoryCache = globalCache.bind("npm-history");
  export const gitstarCache = globalCache.bind("gitstar");

// Re-export the Redis-backed cache facade so imports from
// `@/features/shared/cache` resolve correctly to our new module too.
// IMPORTANT: Point explicitly to './cache/index' to avoid resolving this file ('cache.ts').
export { Cache } from './cache/index';
export { CachePolicy } from './cache/policy';
  