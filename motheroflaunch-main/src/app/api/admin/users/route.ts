import { connectToMongo } from '@features/shared/lib/mongoose';
import { requireAdmin } from '@features/shared/utils/auth';
import { getPaginatedUsers } from '@features/users/services/users';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await requireAdmin(); 

  const { searchParams } = new URL(request.url);

  // Extract the query parameters from the URL
  const cursor = searchParams.get('cursor') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const searchQuery = searchParams.get('searchQuery') || undefined; // Extract searchQuery
  const role = searchParams.get('role') || undefined; // Extract role

  try {
    // Fetch paginated users with filters
    const result = await getPaginatedUsers(
      cursor,
      limit,
      searchQuery,
      role
    );

    return NextResponse.json(result); // Return the fetched data as JSON
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
