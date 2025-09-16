import { NextResponse } from 'next/server';
import { verifyPendingApps } from '../../../../utils/verificationService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Verify webhook secret for security
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.WEBHOOK_SECRET || process.env.CRON_SECRET;
    
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      console.log('❌ Unauthorized webhook request');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting app verification webhook...');
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    // Run app verification
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
      success: true,
      message: 'App verification completed successfully',
      timestamp: new Date().toISOString(),
      appVerification: {
        summary,
        results: verificationResults.slice(0, 10) // Return first 10 results for logging
      }
    });

  } catch (error) {
    console.error('❌ App verification webhook error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'App verification webhook failed', 
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Also support GET for simple webhook services that only support GET
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const expectedSecret = process.env.WEBHOOK_SECRET || process.env.CRON_SECRET;
  
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  return POST(request);
}
