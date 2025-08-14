import { NextResponse } from 'next/server';
import { verifyPendingApps } from '../../../../utils/verificationService';

export async function POST(request: Request) {
  try {
    // Verify cron secret to ensure this is called by the cron service
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      console.log('❌ Unauthorized cron request');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting automated app verification with intelligent scoring...');
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    const results = await verifyPendingApps();
    
    console.log(`✅ Verification completed. Processed ${results.length} apps.`);
    
    // Calculate detailed statistics
    const summary = {
      total: results.length,
      verified: results.filter(r => r.score?.status === 'verified').length,
      needsReview: results.filter(r => r.score?.status === 'needs_review').length,
      failed: results.filter(r => r.score?.status === 'failed').length,
      averageScore: results.reduce((sum, r) => sum + (r.score?.total || 0), 0) / results.length,
      methodBreakdown: {
        static: results.filter(r => r.method === 'static').length,
        rendered: results.filter(r => r.method === 'rendered').length,
        adminReview: results.filter(r => r.method === 'admin_review').length
      }
    };
    
    console.log('📊 Verification Summary:', summary);
    
    // Log detailed results for monitoring
    results.forEach(result => {
      const status = result.score?.status || 'unknown';
      const score = result.score?.total || 0;
      const method = result.method || 'unknown';
      console.log(`📱 ${result.appName || 'Unknown App'}: ${status} (${score}/100) via ${method}`);
    });
    
    return NextResponse.json({
      message: 'Automated verification completed',
      timestamp: new Date().toISOString(),
      summary,
      results: results.slice(0, 10) // Return first 10 results for logging
    });

  } catch (error) {
    console.error('❌ Automated verification error:', error);
    return NextResponse.json(
      { 
        message: 'Automated verification failed', 
        timestamp: new Date().toISOString(),
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
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    const results = await verifyPendingApps();
    
    const summary = {
      total: results.length,
      verified: results.filter(r => r.score?.status === 'verified').length,
      needsReview: results.filter(r => r.score?.status === 'needs_review').length,
      failed: results.filter(r => r.score?.status === 'failed').length,
      averageScore: results.reduce((sum, r) => sum + (r.score?.total || 0), 0) / results.length
    };
    
    console.log('📊 Manual Verification Summary:', summary);
    
    return NextResponse.json({
      message: 'Manual verification completed',
      timestamp: new Date().toISOString(),
      summary,
      results: results.slice(0, 10)
    });

  } catch (error) {
    console.error('❌ Manual verification error:', error);
    return NextResponse.json(
      { 
        message: 'Manual verification failed', 
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
