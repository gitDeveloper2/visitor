import { getAvailability, getProductBookingDate } from  "@features/booking/service/bookingService";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const [availabilityMap, currentProductDate] = await Promise.all([
    getAvailability(),
    productId ? getProductBookingDate(productId) : null,
  ]);

  return Response.json({
    availability: Object.fromEntries(availabilityMap),
    currentProductDate,
  });
}
