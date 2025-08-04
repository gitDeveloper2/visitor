import { BoundCacheLayer, CacheLayer, CacheOptions, LogLevel } from "./caching";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export default class MemoryCacheLayer implements CacheLayer {
  private data = new Map<string, Map<string, CacheEntry<any>>>();
  private defaultTtl = 3 * 60 * 60 * 1000; // 3 hours
  private maxEntries = 1000;

  constructor(private logLevel: LogLevel = "none") {}

  private log(level: LogLevel, msg: string, ...args: any[]) {
    if (this.logLevel === "none") return;
    if (this.logLevel === "basic" && level === "verbose") return;
    // console.log(`[MemoryCache][${level}] ${msg}`, ...args);
  }

  private getSliceMap(slice: string): Map<string, CacheEntry<any>> {
    if (!this.data.has(slice)) this.data.set(slice, new Map());
    return this.data.get(slice)!;
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | undefined> {
    const slice = options?.slice ?? "default";
    const map = this.data.get(slice);
    const entry = map?.get(key);

    if (!entry) {
      this.log("verbose", `MISS [${slice}:${key}]`);
      return undefined;
    }
    if (entry.expiresAt < Date.now()) {
      map!.delete(key);
      this.log("basic", `EXPIRED [${slice}:${key}]`);
      return undefined;
    }

    this.log("verbose", `HIT [${slice}:${key}]`);
    return entry.value;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const slice = options?.slice ?? "default";
    const ttl = options?.ttl ?? this.defaultTtl;
    const map = this.getSliceMap(slice);

    map.set(key, { value, expiresAt: Date.now() + ttl });

    this.log("basic", `SET [${slice}:${key}] TTL=${ttl}ms`);

    if (map.size > this.maxEntries) {
      await this.evictSlice(slice);
    }
  }

  async delete(key: string, options?: CacheOptions): Promise<void> {
    const slice = options?.slice ?? "default";
    this.data.get(slice)?.delete(key);
    this.log("basic", `DELETE [${slice}:${key}]`);
  }

  async clear(options?: { slice?: string }): Promise<void> {
    if (options?.slice) {
      this.data.delete(options.slice);
      this.log("basic", `CLEAR slice [${options.slice}]`);
    } else {
      this.data.clear();
      this.log("basic", `CLEAR all`);
    }
  }

  async evict(): Promise<void> {
for (const slice of Array.from(this.data.keys())) {
      await this.evictSlice(slice);
    }
  }

  private async evictSlice(slice: string) {
    const map = this.data.get(slice);
    if (!map || map.size <= this.maxEntries) return;

    const sorted = Array.from(map.entries()).sort(
      (a, b) => a[1].expiresAt - b[1].expiresAt
    );
    const evictCount = Math.floor(map.size / 10); // evict 10%

    for (let i = 0; i < evictCount; i++) {
      map.delete(sorted[i][0]);
    }

    this.log("basic", `EVICT ${evictCount} entries from [${slice}]`);
  }

  bind(slice: string): BoundCacheLayer {
    return {
      get: (key, opts) => this.get(key, { ...opts, slice }),
      set: (key, value, opts) => this.set(key, value, { ...opts, slice }),
      delete: (key, opts) => this.delete(key, { ...opts, slice }),
      clear: () => this.clear({ slice }),
    };
  }
}
