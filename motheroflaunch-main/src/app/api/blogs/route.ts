// /api/blogs/
import { createBlog, generateUniqueSlug, listPaginatedBlogs } from '@features/blog/services/blogService';

import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const blog = await createBlog(data,session!.user.id);
    return NextResponse.json(blog, { status: 201 });
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor') || undefined;
    const authorId = searchParams.get('authorId') || undefined;
    const publishedOnly = searchParams.get('publishedOnly') === 'true';
    const q = searchParams.get('q')?.trim() || '';

    const result = await   listPaginatedBlogs({
      cursor,
      authorId,
      status:publishedOnly?"published":"draft",
      limit: 10,
      searchQuery: q,
    });
   
    result.items.forEach((blog)=>console.log(blog.title))
    return NextResponse.json(result);
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

