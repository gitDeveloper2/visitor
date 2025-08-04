export async function fetchLocationName(lat: number, lng: number): Promise<string | null> {
  
  try {
    const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&ad
      dressdetails=1`,
            { headers: { 'User-Agent': 'elevation-demo' } }
          );

    const data = await response.json();

    const address = data.address;

    if (!address) return null;

    // Specific location priority
    if (address.attraction) return address.attraction;
    if (address.building) return address.building;

    if (address.road) {
      // Combine road with neighborhood or city to give context
      const context = address.neighbourhood || address.suburb || address.village || address.town || address.city;
      return context ? `${address.road}, ${context}` : address.road;
    }

    // Fallback to progressively less specific
    return (
      address.neighbourhood ||
      address.suburb ||
      address.village ||
      address.town ||
      address.city ||
      address.state ||
      null
    );
  } catch (error) {
    console.error('Failed to fetch location name:', error);
    return null;
  }
}
