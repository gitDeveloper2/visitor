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

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const page = parseInt(url.searchParams.get('page') || '1');
    const category = url.searchParams.get('category');
    const subcategory = url.searchParams.get('subcategory');

    const filter: any = {};
    
    // Admin can see ALL blogs, no user filtering
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (subcategory) filter.subcategories = { $in: [subcategory] };

    const skip = (page - 1) * limit;

    const blogs = await db
      .collection('userblogs')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await db.collection('userblogs').countDocuments(filter);

    return NextResponse.json({ 
      blogs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch blogs.', error: error?.toString() }, { status: 500 });
  }
}
