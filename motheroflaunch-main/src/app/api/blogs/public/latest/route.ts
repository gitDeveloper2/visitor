// /app/api/blogs/latest/route.ts
import { listPublishedBlogsAdvanced } from '@features/blog/services/blogService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor'); // Expecting last blog's createdAt
  const limit = 1;

  try {
    const blogs = await listPublishedBlogsAdvanced({
      limit: limit + 1,
      cursor, // you’ll add this logic inside the service
    });

    const hasMore = blogs.length > limit;
    const nextCursor = hasMore ? blogs[limit - 1].createdAt : null;

    return NextResponse.json({
      blogs: hasMore ? blogs.slice(0, limit) : blogs,
      nextCursor,
    });
  } catch (err: any) {
    console.error('Error fetching paginated latest blogs:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
