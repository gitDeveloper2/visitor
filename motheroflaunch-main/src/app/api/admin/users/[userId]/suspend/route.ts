// app/api/admin/users/[userId]/suspend/route.ts
import { requireAdmin } from '@features/shared/utils/auth';
import { suspendUser } from '@features/users/services/users';
import { NextResponse } from 'next/server';

export async function PATCH(_: Request, { params }: { params:Promise<{ userId: string }> }) {
  console.log("hiting")

  await requireAdmin(); // ✅ Protect route
const{userId}=await params;
  try {
    await suspendUser(userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to suspend user' }, { status: 500 });
  }
}
