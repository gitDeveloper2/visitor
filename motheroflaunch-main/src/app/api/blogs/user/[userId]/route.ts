import { listBlogsByAuthor } from '@features/blog/services/blogService';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  const {userId}=await params;

  try {
    const blogs = await listBlogsByAuthor(userId);
    return NextResponse.json(blogs);
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
