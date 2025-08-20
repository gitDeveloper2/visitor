// /tools/[id]
import { connectToMongo } from "@features/shared/lib/mongoose";
import { updateToolSchema } from "@features/tools/schemas/Tools";
import { deleteTool, getTool, updateTool } from "@features/tools/service/toolService";
import { NextResponse } from "next/server";

export async function GET(req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id}=await params;
  await connectToMongo();

  const tool = await getTool(id);
  
  if (!tool) {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }

  return NextResponse.json(tool);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }>}
  
) {
  const {id}=await params;

  await connectToMongo();

  const json = await req.json();
  const parsed = updateToolSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const updated = await updateTool(id, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Update failed or tool not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }>}
) {
  const {id}=await params;
  await connectToMongo();

  const deleted = await deleteTool(id);
  if (!deleted) {
    return NextResponse.json({ error: "Delete failed or tool not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
