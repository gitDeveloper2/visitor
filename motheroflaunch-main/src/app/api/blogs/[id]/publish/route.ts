import {  publishBlog, unpublishBlog } from '@features/blog/services/blogService';
import { NextResponse } from 'next/server';

export async function POST(_: Request, { params }: { params:  Promise<{ id: string }> }) {
  const {id}=await params;
  try {
    const blog = await  publishBlog(id);
    return NextResponse.json(blog);
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string } >}
) {
  const {id}=await params;
  try {
    const { published:action } = await req.json(); // { action: "publish" | "unpublish" }


    const blog = action
      ?await publishBlog(id) 
      : await unpublishBlog(id);

    return NextResponse.json(blog);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
