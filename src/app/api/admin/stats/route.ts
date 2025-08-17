import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

async function isAdmin(session: any) {
  return session && session.user && session.user.role === 'admin';
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    if (!await isAdmin(session)) {
      return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
    }

    const { db } = await connectToDatabase();

    // Get app statistics
    const appStats = await db.collection('userapps').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get verification statistics for apps
    const verificationStats = await db.collection('userapps').aggregate([
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get blog statistics
    const blogStats = await db.collection('userblogs').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Process app stats
    const apps = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    appStats.forEach(stat => {
      apps.total += stat.count;
      if (stat._id === 'pending') apps.pending = stat.count;
      if (stat._id === 'approved') apps.approved = stat.count;
      if (stat._id === 'rejected') apps.rejected = stat.count;
    });

    // Process verification stats
    const verification = {
      pending: 0,
      verified: 0,
      failed: 0,
      not_required: 0
    };

    verificationStats.forEach(stat => {
      if (stat._id === 'pending') verification.pending = stat.count;
      if (stat._id === 'verified') verification.verified = stat.count;
      if (stat._id === 'failed') verification.failed = stat.count;
      if (stat._id === 'not_required') verification.not_required = stat.count;
    });

    // Process blog stats
    const blogs = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    blogStats.forEach(stat => {
      blogs.total += stat.count;
      if (stat._id === 'pending') blogs.pending = stat.count;
      if (stat._id === 'approved') blogs.approved = stat.count;
      if (stat._id === 'rejected') blogs.rejected = stat.count;
    });

    return NextResponse.json({ 
      apps: { ...apps, verification },
      blogs
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch stats.', error: error?.toString() }, { status: 500 });
  }
}
