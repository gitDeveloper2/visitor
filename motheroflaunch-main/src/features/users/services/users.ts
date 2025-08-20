import { Types } from 'mongoose';
import User, { IUser } from '../models/User';

interface PaginatedUsers {
  users: IUser[];
  nextCursor: string | null;
}

export async function getPaginatedUsers(
  cursor?: string,
  limit = 20,
  searchQuery?: string,
  role?: string
): Promise<PaginatedUsers> {
  const query: any = {};

  if (cursor) {
    query._id = { $lt: new Types.ObjectId(cursor) };
  }

  // Add search query filter if provided (case-insensitive)
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } }, // search by name (case-insensitive)
      { email: { $regex: searchQuery, $options: 'i' } } // search by email (case-insensitive)
    ];
  }

  // Add role filter if provided
  if (role && role !== 'all') {
    query.role = role;
  }

  // Fetch users with the filter
  const users = await User.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  // Determine if there's a next page based on the number of users
  const hasNextPage = users.length > limit;
  const nextCursor = hasNextPage ? users[limit]._id.toString() : null;

  return {
    users: hasNextPage ? users.slice(0, limit) : users,
    nextCursor,
  };
}



export async function suspendUser(userId: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $set: { suspended: true } });
}

export async function unsuspendUser(userId: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $set: { suspended: false } });
}

export async function promoteToAdmin(userId: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $set: { role: 'admin' } });
}
export async function demoteFromAdmin(userId: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $set: { role: 'user' } });
}


export async function deleteUser(userId: string): Promise<void> {
  await User.deleteOne({ _id: userId });
}
