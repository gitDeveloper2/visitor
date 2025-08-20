// app/api/admin/users/[userId]/promote/route.ts
import { requireAdmin } from '@features/shared/utils/auth';
import { demoteFromAdmin, promoteToAdmin } from '@features/users/services/users';
import { NextResponse } from 'next/server';

export async function PATCH(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  console.log("a hit")

  await requireAdmin(); // ✅ Protect route
  console.log("a hit")
const {userId}=await params
  try {
    await demoteFromAdmin(userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 });
  }
}
