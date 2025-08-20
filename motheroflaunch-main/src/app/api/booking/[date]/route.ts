// app/api/booking/[date]/route.ts
import { getBookingsByDate } from "@features/booking/service/bookingService";
import { connectToMongo } from "@features/shared/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const date=(await params).date
    await connectToMongo();
    const bookings = await getBookingsByDate(date);
    return NextResponse.json(bookings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
