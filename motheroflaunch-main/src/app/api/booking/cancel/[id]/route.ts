// app/api/booking/cancel/[id]/route.ts
import { cancelBooking } from "@features/booking/service/bookingService";
import { connectToMongo } from "@features/shared/lib/mongoose";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongo();
    const result = await cancelBooking(params.id);
    return NextResponse.json({ success: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
