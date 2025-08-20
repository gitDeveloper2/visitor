// app/api/admin/users/[userId]/route.ts
import { requireAdmin } from '@features/shared/utils/auth';
import { deleteUser } from '@features/users/services/users';
import { NextResponse } from 'next/server';

export async function DELETE(_: Request, { params }: { params: Promise<{ userId: string }>  }) {
  console.log("a hit")

  await requireAdmin(); // ✅ Protect route
  const{userId}=await params;
  try {
    await deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
