import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';

export async function GET() {
  try {
    console.log("🧪 Test endpoint called");
    
    const { db } = await connectToDatabase();
    console.log("✅ Database connected successfully");
    
    // Test basic database operations
    const collections = await db.listCollections().toArray();
    console.log("📚 Available collections:", collections.map(c => c.name));
    
    // Test if userapps collection exists and has data
    const userappsCollection = db.collection('userapps');
    const count = await userappsCollection.countDocuments();
    console.log("📊 Total documents in userapps:", count);
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connection test passed',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      userappsCount: count,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Test endpoint error:", error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Database connection test failed',
      error: error?.toString(),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 