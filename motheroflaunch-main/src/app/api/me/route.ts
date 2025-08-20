// /app/api/me/route.ts
import { connectToMongo } from "@features/shared/lib/mongoose";
import User from "@features/users/models/User";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { headers } from "next/headers";

// GET /api/me - fetch current user's profile
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToMongo();
  const user = await User.findOne({ email: session.user.email }).lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const {
    name,
    email,
    avatarUrl,
    bio,
    websiteUrl,
    githubUsername,
    twitterUsername,
    role,
    socialAccounts, 

  } = user;

  return NextResponse.json({
    name,
    email,
    avatarUrl,
    bio,
    websiteUrl,
    githubUsername,
    twitterUsername,
    role,
    socialAccounts
  });
}

// PATCH /api/me - update current user's profile
export async function PATCH(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log(body)
  const socialAccounts =
  Array.isArray(body.socialAccounts)
    ? body.socialAccounts.map(({ type, username, url }) => ({
        type,
        username,
        url,
      }))
    : [];

  const allowedUpdates = {
    name: body.name,
    avatarUrl: body.avatarUrl,
    bio: body.bio,
    websiteUrl: body.websiteUrl,
    twitterUsername: body.twitterUsername,
    socialAccounts, // <-- normalized here

  };

 

  await connectToMongo();
  const updated = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
