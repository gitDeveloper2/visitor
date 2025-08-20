// src/mockApi.ts

export type Availability = {
    date: string; // format: 'YYYY-MM-DD'
    remaining: number;
  };
  
  // Fake API that returns mocked availability
// api/bookings/availability.ts

export const fetchAvailability = async (
  from: string,
  to: string
): Promise<{ date: string; remaining: number }[]> => {
  const res = await fetch(`/api/bookings/availability?from=${from}&to=${to}`);

  if (!res.ok) throw new Error("Failed to fetch availability");

  return res.json();
};

  