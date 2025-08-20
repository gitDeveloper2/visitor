import { objectId } from '@features/blog/schema/schema';
import { toggleSuspendedBlog } from '@features/blog/services/blogService';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params:Promise< { id: string }> }) {
    const {id}=await params;
  try {
    const blogId = id;
    objectId.parse(blogId); // validates ObjectId

    const { suspend } = await req.json(); // expect { suspend: true | false }

    const updated = await toggleSuspendedBlog(blogId, suspend);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
