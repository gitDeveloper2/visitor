// models/Booking.ts
import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // or "Tool" if that's your actual model name
      required: true,
      unique: true, // ✅ Ensures only one booking per product
    },
    date: {
      type: String,
      required: true, // format: YYYY-MM-DD
    },
  },
  { timestamps: true }
);

// ❌ REMOVE this index if product should only be booked once ever
// bookingSchema.index({ productId: 1, date: 1 }, { unique: true }); // ← Not needed

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
