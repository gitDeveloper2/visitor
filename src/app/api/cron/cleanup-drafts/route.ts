import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Calculate cutoff date (7 days ago)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log(`🧹 Starting automatic draft cleanup at ${new Date().toISOString()}`);
    console.log(`📅 Deleting drafts older than: ${sevenDaysAgo.toISOString()}`);

    // Delete expired blog drafts
    const blogResult = await db.collection('blog_drafts').deleteMany({
      createdAt: { $lt: sevenDaysAgo },
      premiumReady: false, // Only delete drafts that weren't used for premium
    });

    // Delete expired app drafts
    const appResult = await db.collection('app_drafts').deleteMany({
      createdAt: { $lt: sevenDaysAgo },
      premiumReady: false, // Only delete drafts that weren't used for premium
    });

    const totalDeleted = blogResult.deletedCount + appResult.deletedCount;
    console.log(`✅ Cleanup completed: ${blogResult.deletedCount} blog drafts and ${appResult.deletedCount} app drafts deleted (total: ${totalDeleted})`);

    return NextResponse.json({
      success: true,
      message: `Cleanup completed successfully`,
      deletedCount: totalDeleted,
      blogDraftsDeleted: blogResult.deletedCount,
      appDraftsDeleted: appResult.deletedCount,
      cutoffDate: sevenDaysAgo.toISOString(),
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error during draft cleanup:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to cleanup drafts', 
        error: (error as Error)?.toString() 
      }, 
      { status: 500 }
    );
  }
}

// This endpoint can be called by external cron services
export async function POST() {
  return GET();
} 