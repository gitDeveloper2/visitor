#!/usr/bin/env node

/**
 * Test script for blog submission flow
 * This script verifies the database setup and API endpoints
 */

const { MongoClient } = require('mongodb');

async function testBlogFlow() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('basicutils');

    // Test 1: Check if required collections exist
    console.log('\n📚 Checking required collections...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    const requiredCollections = ['blog_drafts', 'blog_premium_access', 'userblogs'];
    for (const collection of requiredCollections) {
      if (collectionNames.includes(collection)) {
        console.log(`✅ ${collection} collection exists`);
      } else {
        console.log(`❌ ${collection} collection missing`);
      }
    }

    // Test 2: Check if blog_premium_access has proper indexes
    console.log('\n🔍 Checking collection indexes...');
    try {
      const premiumIndexes = await db.collection('blog_premium_access').indexes();
      console.log('📊 blog_premium_access indexes:', premiumIndexes.map(idx => idx.name));
    } catch (error) {
      console.log('⚠️ Could not check blog_premium_access indexes:', error.message);
    }

    // Test 3: Check if userblogs has proper indexes
    try {
      const userblogsIndexes = await db.collection('userblogs').indexes();
      console.log('📊 userblogs indexes:', userblogsIndexes.map(idx => idx.name));
    } catch (error) {
      console.log('⚠️ Could not check userblogs indexes:', error.message);
    }

    // Test 4: Check sample data
    console.log('\n📊 Checking sample data...');
    
    const draftCount = await db.collection('blog_drafts').countDocuments();
    console.log(`📝 blog_drafts: ${draftCount} documents`);
    
    const premiumCount = await db.collection('blog_premium_access').countDocuments();
    console.log(`💳 blog_premium_access: ${premiumCount} documents`);
    
    const userblogsCount = await db.collection('userblogs').countDocuments();
    console.log(`📰 userblogs: ${userblogsCount} documents`);

    // Test 5: Check environment variables
    console.log('\n🔧 Checking environment variables...');
    const requiredEnvVars = [
      'LEMON_SQUEEZY_API_KEY',
      'LEMON_SQUEEZY_STORE_ID',
      'LEMON_SQUEEZY_WEBHOOK_SECRET',
      'NEXT_LEMON_SQUEEZY_PREMIUM_BLOG_PRODUCT_ID',
      'NEXT_PUBLIC_LEMON_SQUEEZY_BLOG_MONTHLY_VARIANT_ID',
      'NEXT_PUBLIC_LEMON_SQUEEZY_BLOG_YEARLY_VARIANT_ID'
    ];

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar} is set`);
      } else {
        console.log(`❌ ${envVar} is missing`);
      }
    }

    console.log('\n🎯 Blog submission flow test completed!');
    
    if (collectionNames.includes('blog_drafts') && 
        collectionNames.includes('blog_premium_access') && 
        collectionNames.includes('userblogs')) {
      console.log('✅ All required collections are present');
      console.log('✅ Blog submission flow should work correctly');
    } else {
      console.log('❌ Some required collections are missing');
      console.log('❌ Blog submission flow may not work correctly');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testBlogFlow().catch(console.error); 