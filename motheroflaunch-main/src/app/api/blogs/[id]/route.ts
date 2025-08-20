// /api/blogs/[id]
import { deleteBlog, getBlogById, updateBlog } from '@features/blog/services/blogService';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params:Promise< { id: string }> }) {
  const {id}=await params;
  try {
    const blog = await getBlogById(id);
    if (!blog) return new NextResponse('Not found', { status: 404 });
    return NextResponse.json(blog);
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}




export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const {id}=await params;

  try {
    const data = await req.json();
    const blog = await updateBlog(id, data);
    return NextResponse.json(blog);
  } catch (err:any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const {id}=await params;
  try {
    const result = await deleteBlog(id);
    return NextResponse.json(result);
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
