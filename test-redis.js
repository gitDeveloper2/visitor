// Simple test script to verify Redis connection
const { redis } = require('./src/lib/voting/redis.ts');

async function testRedis() {
  try {
    console.log('Testing Redis connection...');
    const client = await redis;
    
    // Test basic operations
    await client.set('test:key', 'test-value');
    const value = await client.get('test:key');
    console.log('✅ Redis test successful:', value);
    
    // Clean up
    await client.del('test:key');
    console.log('✅ Redis connection working properly');
    
  } catch (error) {
    console.error('❌ Redis test failed:', error);
  }
}

testRedis();
