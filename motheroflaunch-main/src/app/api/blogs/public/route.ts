import { listPublishedBlogsAdvanced } from '@features/blog/services/blogService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [featured, trending, latest] = await Promise.all([
      listPublishedBlogsAdvanced({ featuredOnly: true, limit: 4 }),
      listPublishedBlogsAdvanced({ trending: true, limit: 5 }),
      listPublishedBlogsAdvanced({ limit: 6 }), // latest
    ]);

    return NextResponse.json({ featured, trending, latest });
  } catch (err: any) {
    console.error('Error fetching public blogs:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
