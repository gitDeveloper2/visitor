import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getActiveLaunch } from '@/lib/launches';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get today's date range
    const today = new Date();
    const y = today.getUTCFullYear();
    const m = String(today.getUTCMonth() + 1).padStart(2, '0');
    const d = String(today.getUTCDate()).padStart(2, '0');
    const start = new Date(`${y}-${m}-${d}T00:00:00.000Z`);
    const end = new Date(`${y}-${m}-${d}T23:59:59.999Z`);
    
    // Check active launch
    const activeLaunch = await getActiveLaunch();
    
    // Check today's apps by launchDate
    const todaysAppsByLaunchDate = await db.collection('userapps')
      .find({ 
        status: 'approved', 
        launchDate: { $gte: start, $lte: end } 
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Check recently approved apps (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentlyApproved = await db.collection('userapps')
      .find({ 
        status: 'approved',
        updatedAt: { $gte: yesterday }
      })
      .sort({ updatedAt: -1 })
      .toArray();
    
    // Check all launches in collection
    const allLaunches = await db.collection('launches')
      .find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();
    
    return NextResponse.json({
      success: true,
      debug: {
        todayDateRange: {
          start: start.toISOString(),
          end: end.toISOString()
        },
        activeLaunch: activeLaunch ? {
          _id: activeLaunch._id.toString(),
          date: activeLaunch.date,
          status: activeLaunch.status,
          appsCount: activeLaunch.apps.length
        } : null,
        todaysAppsByLaunchDate: {
          count: todaysAppsByLaunchDate.length,
          apps: todaysAppsByLaunchDate.map(app => ({
            _id: app._id.toString(),
            name: app.name,
            launchDate: app.launchDate,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          }))
        },
        recentlyApproved: {
          count: recentlyApproved.length,
          apps: recentlyApproved.map(app => ({
            _id: app._id.toString(),
            name: app.name,
            launchDate: app.launchDate,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          }))
        },
        allLaunches: allLaunches.map(launch => ({
          _id: launch._id.toString(),
          date: launch.date,
          status: launch.status,
          appsCount: launch.apps?.length || 0,
          createdAt: launch.createdAt
        }))
      }
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
