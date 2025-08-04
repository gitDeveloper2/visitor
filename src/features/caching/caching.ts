export type LogLevel = "none" | "basic" | "verbose";

export interface CacheOptions {
  ttl?: number; // in milliseconds, default 3 hours
  logLevel?: LogLevel;
  slice?: string; // optional grouping prefix
}

export interface CacheLayer {
  get<T>(key: string, options?: CacheOptions): Promise<T | undefined>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string, options?: CacheOptions): Promise<void>;
  clear(options?: { slice?: string }): Promise<void>;
  evict(): Promise<void>; // optional LRU handling
  bind(slice: string): BoundCacheLayer;
}

export interface BoundCacheLayer {
  get<T>(key: string, options?: Omit<CacheOptions, "slice">): Promise<T | undefined>;
  set<T>(key: string, value: T, options?: Omit<CacheOptions, "slice">): Promise<void>;
  delete(key: string, options?: Omit<CacheOptions, "slice">): Promise<void>;
  clear(): Promise<void>;
}
