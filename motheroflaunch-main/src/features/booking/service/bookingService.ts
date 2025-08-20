import mongoose, { Schema } from "mongoose";
import { acquireLock, releaseLock } from "@features/shared/utils/redislock";

/**
 * ─── Booking Model ───────────────────────────────────────────────────────
 * - productId: the product/tool being booked
 * - date: the launch date (YYYY-MM-DD format)
 * - Only 20 bookings per date allowed
 * - A product can only be booked once (ever)
 */

const bookingSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    date: { type: String, required: true }, // format: YYYY-MM-DD
  },
  { timestamps: true }
);

// ✅ Enforce only one booking per product
bookingSchema.index({ productId: 1 }, { unique: true });

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

/**
 * ─── Book A Product ──────────────────────────────────────────────────────
 * - Locks the date slot
 * - Prevents duplicate bookings for a product
 * - Prevents exceeding 20 per date
 */
export async function bookProduct(productId: string, date: string) {
  const lockKey = `lock:booking:${date}`;
  const lockAcquired = await acquireLock(lockKey);

  if (!lockAcquired) {
    throw new Error("Booking is being processed. Try again shortly.");
  }

  try {
    // Check if this product has already been booked
    const alreadyBooked = await Booking.findOne({ productId });
    if (alreadyBooked) {
      throw new Error("This product has already been booked.");
    }

    // Limit total bookings per date
    const count = await Booking.countDocuments({ date });
    if (count >= 20) {
      throw new Error("This date is fully booked.");
    }

    const booking = await Booking.create({ productId, date });
    return { success: true, booking };
  } finally {
    await releaseLock(lockKey);
  }
}

/**
 * ─── Check Availability ──────────────────────────────────────────────────
 * Returns a list of dates with how many slots are remaining
 */
export async function getAvailability() {
  const result = await Booking.aggregate([
    {
      $group: {
        _id: "$date",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        date: "$_id",
        remaining: { $subtract: [20, "$count"] },
        _id: 0,
      },
    },
  ]);

  return result; // e.g. [{ date: '2025-07-12', remaining: 5 }]
}


/**
 * Returns the date a product has been booked for, if any.
 * @param productId - The ID of the product
 * @returns string | null - The booked date in "YYYY-MM-DD" format
 */
export async function getProductBookingDate(productId: string): Promise<string | null> {
  const booking = await Booking.findOne({ productId });

  return booking ? booking.date : null;
}


/**
 * ─── Get All Bookings For A Date ─────────────────────────────────────────
 */
export async function getBookingsByDate(date: string) {
  return Booking.find({ date });
}

/**
 * ─── Cancel Booking By ID ────────────────────────────────────────────────
 */
export async function cancelBooking(id: string) {
  const deleted = await Booking.findByIdAndDelete(id);
  return !!deleted;
}
