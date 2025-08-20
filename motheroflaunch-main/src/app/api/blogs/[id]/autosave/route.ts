import { autosaveBlog } from '@features/blog/services/blogService';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise< { id: string }> }) {
  try {
    const {id}=await params;
    const data = await req.json();
    const blog = await autosaveBlog(id, data);
    return NextResponse.json(blog);
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
