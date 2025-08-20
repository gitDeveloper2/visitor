// app/api/admin/users/[userId]/unsuspend/route.ts
import { requireAdmin } from '@features/shared/utils/auth';
import { unsuspendUser } from '@features/users/services/users';
import { NextResponse } from 'next/server';

export async function PATCH(_: Request, { params }: { params: Promise<{ userId: string }>  }) {
  await requireAdmin(); // ✅ Protect route
  const{userId}=await params;

  try {
    await unsuspendUser(userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to unsuspend user' }, { status: 500 });
  }
}
