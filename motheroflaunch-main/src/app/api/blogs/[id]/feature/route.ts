import { togglePaidFeatureBlog } from '@features/blog/services/blogService';
import {NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const{id}=await params;
  try {
    const { value } = await req.json(); // { value: boolean }
    const blog = await togglePaidFeatureBlog(id, value);
    return NextResponse.json(blog);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
