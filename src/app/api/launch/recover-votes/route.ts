import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { date, appIds } = await req.json();
    if (!date) return NextResponse.json({ error: 'date (YYYY-MM-DD) required' }, { status: 400 });

    const { db } = await connectToDatabase();
    const backupCol = db.collection('vote_backups');
    const appsCol = db.collection('userapps');

    // Find backup data for the specified date/apps
    const query: any = {
      backedUpAt: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lt: new Date(`${date}T23:59:59.999Z`)
      }
    };

    if (appIds && Array.isArray(appIds)) {
      query.appId = { $in: appIds };
    }

    const backups = await backupCol.find(query).toArray();
    
    if (!backups.length) {
      return NextResponse.json({ 
        success: false, 
        message: 'No backup data found for the specified date/apps' 
      });
    }

    console.log(`[Recover] Found ${backups.length} backup records`);

    // Update apps with backup vote data
    const bulk = appsCol.initializeUnorderedBulkOp();
    for (const backup of backups) {
      bulk.find({ _id: backup.appId }).updateOne({
        $set: {
          likes: backup.votes,
          'stats.votes': backup.votes,
          finalVotes: backup.votes,
          votingFlushed: true,
          recoveredFromBackup: true,
          recoveredAt: new Date()
        },
      });
    }

    const result = await bulk.execute();
    console.log(`[Recover] Recovered votes for ${result.modifiedCount} apps`);

    return NextResponse.json({
      success: true,
      recovered: result.modifiedCount,
      backups: backups.length,
      message: `Recovered votes for ${result.modifiedCount} apps from backup`
    });

  } catch (e: any) {
    console.error('[Recover] Error:', e);
    return NextResponse.json({ 
      error: e?.message || 'Internal error' 
    }, { status: 500 });
  }
} 