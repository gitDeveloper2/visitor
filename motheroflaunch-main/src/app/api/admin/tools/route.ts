// /app/api/tools/route.ts

import { requireAdmin } from '@features/shared/utils/auth';
import { toolService } from '@features/tools/service/adminService';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    await requireAdmin(); // ✅ Protect route

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  console.log("cursor",cursor)
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const searchQuery = url.searchParams.get('searchQuery') || undefined;
  const status = url.searchParams.get('status') || undefined;
  try {
    const data = await toolService.fetchTools({
      cursor,
      limit,
      searchQuery,
      status,
    });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
