// /app/api/tools/[toolId]/delete/route.ts

import { toolService } from '@features/tools/service/adminService';
import { NextResponse } from 'next/server';

export async function DELETE(_: Request,{ params }: { params: Promise<{ toolId: string }>}) {
  console.log("delting")

  const { toolId } = await params;
  if (!toolId) {
    return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
  }

  try {
    await toolService.deleteTool(toolId);
    return NextResponse.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
  }
}
