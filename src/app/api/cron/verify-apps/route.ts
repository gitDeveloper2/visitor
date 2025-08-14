import { NextResponse } from 'next/server';
import { verifyPendingApps } from '../../../../utils/verificationService';

export async function POST(request: Request) {
  try {
    // Verify cron secret to ensure this is called by the cron service
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting automated app verification...');
    
    const results = await verifyPendingApps();
    
    console.log(`✅ Verification completed. Processed ${results.length} apps.`);
    
    const successCount = results.filter(r => r.success && r.found).length;
    const failureCount = results.filter(r => !r.success || !r.found).length;
    
    return NextResponse.json({
      message: 'Automated verification completed',
      totalProcessed: results.length,
      successful: successCount,
      failed: failureCount,
      results: results.slice(0, 10) // Return first 10 results for logging
    });

  } catch (error) {
    console.error('❌ Automated verification error:', error);
    return NextResponse.json(
      { 
        message: 'Automated verification failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing (remove in production)
export async function GET(request: Request) {
  try {
    console.log('🔄 Manual verification trigger...');
    
    const results = await verifyPendingApps();
    
    return NextResponse.json({
      message: 'Manual verification completed',
      totalProcessed: results.length,
      results: results.slice(0, 10)
    });

  } catch (error) {
    console.error('❌ Manual verification error:', error);
    return NextResponse.json(
      { 
        message: 'Manual verification failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
