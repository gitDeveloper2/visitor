import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'date parameter required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const appsCol = db.collection('userapps');
    const backupCol = db.collection('vote_backups');

    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    // Check apps that should have been finalized
    const launchedApps = await appsCol.find({
      status: 'approved',
      launchDate: { $gte: start, $lte: end }
    }).toArray();

    // Check backup data
    const backups = await backupCol.find({
      backedUpAt: { $gte: start, $lt: end }
    }).toArray();

    // Analyze health status
    const health = {
      date,
      totalLaunchedApps: launchedApps.length,
      finalizedApps: launchedApps.filter(app => app.votingFlushed).length,
      unflushedApps: launchedApps.filter(app => !app.votingFlushed).length,
      backupRecords: backups.length,
      issues: [] as string[],
      recommendations: [] as string[]
    };

    // Detect issues
    if (health.unflushedApps > 0) {
      health.issues.push(`${health.unflushedApps} apps have not been finalized`);
      health.recommendations.push('Run finalize endpoint to process unflushed apps');
    }

    if (health.backupRecords === 0 && health.totalLaunchedApps > 0) {
      health.issues.push('No backup data found for launched apps');
      health.recommendations.push('Check if finalize process completed successfully');
    }

    if (health.backupRecords !== health.totalLaunchedApps) {
      health.issues.push(`Backup count (${health.backupRecords}) doesn't match launched apps (${health.totalLaunchedApps})`);
      health.recommendations.push('Investigate missing backup records');
    }

    // Check for apps with inconsistent vote data
    const inconsistentApps = launchedApps.filter(app => {
      const backup = backups.find(b => b.appId === String(app._id));
      return backup && backup.votes !== app.likes;
    });

    if (inconsistentApps.length > 0) {
      health.issues.push(`${inconsistentApps.length} apps have inconsistent vote data`);
      health.recommendations.push('Consider running vote recovery process');
    }

    const status = health.issues.length === 0 ? 'healthy' : 'issues_detected';

    return NextResponse.json({
      status,
      health,
      timestamp: new Date().toISOString()
    });

  } catch (e: any) {
    console.error('[VoteHealth] Error:', e);
    return NextResponse.json({ 
      status: 'error',
      error: e?.message || 'Internal error' 
    }, { status: 500 });
  }
} 