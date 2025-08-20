// src/app/api/tools/route.ts
import { NextResponse } from "next/server";
import { connectToMongo } from "../../../features/shared/lib/mongoose";
import { createTool, getPaginatedTools } from "../../../features/tools/service/toolService";
import { createToolSchema } from "../../../features/tools/schemas/Tools";

export async function GET(req: Request) {
  await connectToMongo();

  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get("size") || "10");
  const query = searchParams.get("query") || "";
  const tag = searchParams.get("tag") || undefined;
  const category = searchParams.get("category") || undefined;
  const cursor = searchParams.get("cursor") || undefined;
const rawPeriod = searchParams.get("period");
const period = rawPeriod === "daily" || rawPeriod === "weekly" || rawPeriod === "monthly"
  ? rawPeriod
  : undefined;

  const result = await getPaginatedTools(size, cursor, query, tag, category, period); // 👈 Pass it through
  return NextResponse.json(result);
}


export async function POST(req: Request) {
 

  const body = await req.json();
  


  const result = createToolSchema.safeParse(body);
  

  if (!result.success) {
    console.log(result.error)
    return NextResponse.json({ error: result.error.format() }, { status: 400 });
  }
  const created = await createTool({
    ...result.data,
    votingFlushed: false, // or true/null depending on your logic
  });
  return NextResponse.json(created, { status: 201 });
}
