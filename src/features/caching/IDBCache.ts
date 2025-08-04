import { openDB } from "idb";
import { BoundCacheLayer, CacheLayer, CacheOptions, LogLevel } from "./caching";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  lastAccessed: number; // New field for tracking last accessed time
};

export default class IDBCacheLayer implements CacheLayer {
  private db: any;
  private defaultTtlMs = 3 * 60 * 60 * 1000; // 3 hours by default
  private logLevel: LogLevel = "none";
  private maxEntries = 20;
  private EXPIRY_THRESHOLD_MS: number;

  constructor(logLevel: LogLevel = "none") {
    this.logLevel = logLevel;
    this.EXPIRY_THRESHOLD_MS = parseInt(
      process.env.NEXT_PUBLIC_IDB_EXPIRY_THRESHOLD_MS ?? "300000", // 5 min
      10
    );
    this.initializeDB().then(() => {
      this.cleanupNearExpired(); // run on startup
    });
  }

  private async initializeDB() {
    this.db = await openDB("cacheDB", 1, {
      upgrade(db) {
        const store = db.createObjectStore("cache", {
          keyPath: "key", // key will be the key used for caching
        });
        store.createIndex("expiresAt", "expiresAt"); // For TTL expiry
        store.createIndex("lastAccessed", "lastAccessed"); // For LRU eviction
      },
    });
  }

  private log(level: LogLevel, msg: string, ...args: any[]) {
    if (this.logLevel === "none") return;
    if (this.logLevel === "basic" && level === "verbose") return;
    console.log(`[IDBCache][${level}] ${msg}`, ...args);
  }

  // Eviction strategy based on LRU
  async evict() {
    const tx = this.db.transaction("cache", "readwrite");
    const store = tx.objectStore("cache");
    const index = store.index("lastAccessed");

    let count = 0;
    let cursor = await index.openCursor();

    // Evict until we have less than maxEntries
    while (cursor && (await store.count()) > this.maxEntries) {
      await store.delete(cursor.primaryKey);
      count++;
      cursor = await cursor.continue();
    }

    await tx.done;
    this.log("basic", `Evicted ${count} least-recently-used entries.`);
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | undefined> {
    const slice = options?.slice ?? "default";
    const cacheEntry = await this.db.get("cache", key);
    if (!cacheEntry) {
      this.log("verbose", `MISS [${slice}:${key}]`);
      return undefined;
    }

    if (cacheEntry.expiresAt < Date.now()) {
      await this.db.delete("cache", key);
      this.log("basic", `EXPIRED [${slice}:${key}]`);
      return undefined;
    }

    // Update last accessed time on hit
    cacheEntry.lastAccessed = Date.now();
    await this.db.put("cache", { key, ...cacheEntry });

    this.log("verbose", `HIT [${slice}:${key}]`);
    return cacheEntry.value;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const slice = options?.slice ?? "default";
    const ttl = options?.ttl ?? this.defaultTtlMs;
    const expiresAt = Date.now() + ttl;

    const cacheEntry: CacheEntry<T> = { 
      value, 
      expiresAt, 
      lastAccessed: Date.now() // Set the last accessed time when setting
    };

    await this.db.put("cache", { key, ...cacheEntry });

    this.log("basic", `SET [${slice}:${key}] TTL=${ttl}ms`);

    await this.evict(); // Check for eviction after setting the cache
  }

  async delete(key: string, options?: CacheOptions): Promise<void> {
    const slice = options?.slice ?? "default";
    await this.db.delete("cache", key);
    this.log("basic", `DELETE [${slice}:${key}]`);
  }

  async clear(options?: { slice?: string }): Promise<void> {
    const tx = this.db.transaction("cache", "readwrite");
    const store = tx.objectStore("cache");
    const allEntries = await store.getAll();

    // Delete all entries if slice isn't specified or clear the slice's data
    if (options?.slice) {
      for (const entry of allEntries) {
        await store.delete(entry.key);
      }
      this.log("basic", `CLEAR slice [${options.slice}]`);
    } else {
      await store.clear();
      this.log("basic", `CLEAR all`);
    }
    await tx.done;
  }

  bind(slice: string): BoundCacheLayer {
    return {
      get: (key, opts) => this.get(key, { ...opts, slice }),
      set: (key, value, opts) => this.set(key, value, { ...opts, slice }),
      delete: (key, opts) => this.delete(key, { ...opts, slice }),
      clear: () => this.clear({ slice }),
    };
  }

  async cleanupNearExpired(): Promise<void> {
    console.log("CLEANUP")
    const now = Date.now();
    const tx = this.db.transaction("cache", "readwrite");
    const store = tx.objectStore("cache");

    let cursor = await store.openCursor();
    let count = 0;

    while (cursor) {
      const { expiresAt } = cursor.value as CacheEntry<any>;
      if (expiresAt <= now + this.EXPIRY_THRESHOLD_MS) {
        await cursor.delete();
        count++;
      }
      cursor = await cursor.continue();
    }

    await tx.done;
    if (count > 0) {
      this.log("basic", `CLEANUP removed ${count} near-expired entries`);
    }
  }
}
