// app/api/cloudinary/delete/route.ts
import redis from "@features/shared/lib/redis";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  public_ids: z.array(z.string().min(1)),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { public_ids } = parsed.data;

    // Add all to Redis SET
    console.log("in redis deletes")
    const addedCount = await redis.sadd("cloudinary:to_delete", ...public_ids);

    return NextResponse.json({ status: "queued", addedCount });
  } catch (err: any) {
    console.error("[Cloudinary Queue Error]", err);
    return NextResponse.json(
      { error: "Failed to queue deletions", details: err.message || err },
      { status: 500 }
    );
  }
}
