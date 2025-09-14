import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Mock Redis client for development when Redis is not available
class MockRedisClient {
  private store = new Map<string, string>();
  private sets = new Map<string, Set<string>>();

  async connect() {
    console.log('Using mock Redis client (Redis server not available)');
    return this;
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string): Promise<string> {
    this.store.set(key, value);
    return 'OK';
  }

  async setnx(key: string, value: string): Promise<number> {
    if (!this.store.has(key)) {
      this.store.set(key, value);
      return 1;
    }
    return 0;
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0;
    keys.forEach(key => {
      if (this.store.delete(key)) deleted++;
      if (this.sets.delete(key)) deleted++;
    });
    return deleted;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.sets.has(key)) {
      this.sets.set(key, new Set());
    }
    const set = this.sets.get(key)!;
    let added = 0;
    members.forEach(member => {
      if (!set.has(member)) {
        set.add(member);
        added++;
      }
    });
    return added;
  }

  async sMembers(key: string): Promise<string[]> {
    const set = this.sets.get(key);
    return set ? Array.from(set) : [];
  }

  async expire(key: string, seconds: number): Promise<number> {
    // Mock implementation - just return success
    return 1;
  }

  multi() {
    const commands: Array<() => Promise<any>> = [];
    return {
      set: (key: string, value: string) => {
        commands.push(() => this.set(key, value));
        return this;
      },
      setnx: (key: string, value: string) => {
        commands.push(() => this.setnx(key, value));
        return this;
      },
      sadd: (key: string, ...members: string[]) => {
        commands.push(() => this.sadd(key, ...members));
        return this;
      },
      expire: (key: string, seconds: number) => {
        commands.push(() => this.expire(key, seconds));
        return this;
      },
      del: (...keys: string[]) => {
        commands.push(() => this.del(...keys));
        return this;
      },
      exec: async () => {
        const results = [];
        for (const command of commands) {
          try {
            results.push(await command());
          } catch (error) {
            results.push(error);
          }
        }
        return results;
      }
    };
  }

  on(event: string, callback: Function) {
    // Mock event handling
    return this;
  }
}

// Voting-related Redis keys - MUST MATCH voting API keys exactly
export const votingKeys = {
  // Active voting sessions
  activeSession: (date: string) => `voting:${date}:active`,
  
  // Vote counts - MUST MATCH voting API voteKeys.totalVotes
  toolVotes: (toolId: string) => `vote:tool:${toolId}:total`,
  
  // User votes tracking - MUST MATCH voting API voteKeys.userVoted  
  userVotes: (userId: string, toolId: string) => `vote:user:${userId}:tool:${toolId}`,
  
  // Set of all tools in current voting session - MUST MATCH voting API voteKeys.activeToolsSet
  activeTools: (date: string) => `vote:toolIds:active`
};

// Create and configure Redis client with fallback
let client: any;
let useMockClient = false;

async function createRedisClient() {
  try {
    const realClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 5000),
        connectTimeout: 5000,
      },
    });

    realClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    realClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await realClient.connect();
    console.log('Redis connected successfully');
    return realClient;
  } catch (error) {
    console.warn('Redis connection failed, using mock client:', error instanceof Error ? error.message : 'Unknown error');
    useMockClient = true;
    const mockClient = new MockRedisClient();
    await mockClient.connect();
    return mockClient;
  }
}

// Initialize connection
let isConnected = false;

async function getRedisClient() {
  if (!isConnected) {
    client = await createRedisClient();
    isConnected = true;
  }
  return client;
}

// Global client for development
declare global {
  // eslint-disable-next-line no-var
  var __redisClient: Promise<any> | undefined;
}

// Export a promise that resolves to the connected client
export const redis = global.__redisClient || getRedisClient();

if (process.env.NODE_ENV === 'development') {
  global.__redisClient = redis;
}

export default redis;
