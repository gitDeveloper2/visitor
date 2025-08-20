// /app/api/tools/[toolId]/reschedule/route.ts

import { requireAdmin } from '@features/shared/utils/auth';
import { toolService } from '@features/tools/service/adminService';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ toolId: string }> }) {
  await requireAdmin(); // ✅ Restrict to admins

  const { toolId } = await params;

  if (!toolId) {
    return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
  }

  const body = await req.json();
  console.log("reached",body)
  const { launchDate } = body;

  if (!launchDate || isNaN(Date.parse(launchDate))) {
    return NextResponse.json({ error: 'Valid launchDate is required' }, { status: 400 });
  }

  try {
    await toolService.rescheduleLaunchDate(toolId, new Date(launchDate));
    return NextResponse.json({ message: 'Launch date rescheduled successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reschedule launch date' }, { status: 500 });
  }
}
