
  
  // features/map-elevation/types.ts
export interface Pin {
  lat: number;
  lng: number;
  elevation?: number;
  loading?: boolean;
  error?: string;
  locationName?: string; // 👈 Add this
}
