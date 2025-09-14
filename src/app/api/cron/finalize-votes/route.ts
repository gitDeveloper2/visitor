import { NextResponse } from 'next/server';
import { verifyPendingApps } from '../../../../utils/verificationService';

export async function GET() {
  // No-op: cron finalization handled by Voting API directly
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  return NextResponse.json({ success: true, message: 'Finalization handled by Voting API', date: dateStr });
}

export async function POST(request: Request) {
  try {
    // Verify cron secret to ensure this is called by the cron service
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      console.log('❌ Unauthorized cron request');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting combined finalize-votes and verify-apps cron...');
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    // Handle vote finalization (currently handled by Voting API)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    
    // Run app verification
    console.log('🔄 Starting automated app verification...');
    const verificationResults = await verifyPendingApps();
    
    console.log(`✅ Verification completed. Processed ${verificationResults.length} apps.`);
    
    // Calculate detailed statistics
    const summary = {
      total: verificationResults.length,
      verified: verificationResults.filter(r => r.score?.status === 'verified').length,
      needsReview: verificationResults.filter(r => r.score?.status === 'needs_review').length,
      failed: verificationResults.filter(r => r.score?.status === 'failed').length,
      averageScore: verificationResults.reduce((sum, r) => sum + (r.score?.total || 0), 0) / verificationResults.length,
      methodBreakdown: {
        static: verificationResults.filter(r => r.method === 'static').length,
        rendered: verificationResults.filter(r => r.method === 'rendered').length,
        adminReview: verificationResults.filter(r => r.method === 'admin_review').length
      }
    };
    
    console.log('📊 Verification Summary:', summary);
    
    // Log detailed results for monitoring
    verificationResults.forEach(result => {
      const status = result.score?.status || 'unknown';
      const score = result.score?.total || 0;
      const method = result.method || 'unknown';
      console.log(`📱 ${result.appName || 'Unknown App'}: ${status} (${score}/100) via ${method}`);
    });
    
    return NextResponse.json({
      message: 'Combined finalize-votes and verify-apps completed',
      timestamp: new Date().toISOString(),
      voteFinalization: { 
        success: true, 
        message: 'Finalization handled by Voting API', 
        date: dateStr 
      },
      appVerification: {
        summary,
        results: verificationResults.slice(0, 10) // Return first 10 results for logging
      }
    });

  } catch (error) {
    console.error('❌ Combined cron error:', error);
    return NextResponse.json(
      { 
        message: 'Combined cron failed', 
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}