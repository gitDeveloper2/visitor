// /app/api/tools/[toolId]/unsuspend/route.ts

import { requireAdmin } from '@features/shared/utils/auth';
import { toolService } from '@features/tools/service/adminService';
import { NextResponse } from 'next/server';

export async function PATCH(_: Request,{ params }: { params: Promise<{ toolId: string }> }) {
    await requireAdmin(); // ✅ Protect route

  const { toolId } = await params;

  if (!toolId) {
    return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
  }

  try {
    await toolService.unsuspendTool(toolId);
    return NextResponse.json({ message: 'Tool unsuspended successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unsuspend tool' }, { status: 500 });
  }
}
