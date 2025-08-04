export async function fetchElevation(lat: number, lng: number): Promise<number> {
  const res = await fetch('/api/elevation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  });

  console.log("Elevation API response:", res.status, res.statusText);

  if (!res.ok) {
    let errorMessage = 'Something went wrong.';

    if (res.status === 429) {
      errorMessage = 'Slow down! Too many requests.';
    } else if (res.status === 400) {
      errorMessage = 'Invalid location. Please check the coordinates.';
    } else if (res.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    throw new Error(errorMessage);
  }

  const data = await res.json();

  if (data.error) throw new Error(data.error);

  const elevation = data?.elevation;
  if (typeof elevation !== 'number') {
    throw new Error('Invalid elevation received.');
  }

  return elevation;
}
