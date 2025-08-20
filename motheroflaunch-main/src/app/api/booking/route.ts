// app/api/booking/route.ts
import { bookProduct } from "@features/booking/service/bookingService";
import { connectToMongo } from "@features/shared/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productId, date } = await req.json();
  console.log("data",date )

  if (!productId || !date) {
    return NextResponse.json({ error: "Missing productId or date" }, { status: 400 });
  }

  try {
    await connectToMongo();
    const result = await bookProduct(productId, date);
    
    return NextResponse.json(result);
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
