// utils/gpsValidation.ts

// Allow empty or valid latitude (between -90 and 90)
export const validateLatitude = (latitude: number | string): boolean => {
  if (latitude === "" || latitude === null) return true; // Allow empty
  const numLatitude = parseFloat(latitude as string);
  return numLatitude >= -90 && numLatitude <= 90;
  
};

// Allow empty or valid longitude (between -180 and 180)
export const validateLongitude = (longitude: number | string): boolean => {
  if (longitude === "" || longitude === null) return true; // Allow empty
  const numLongitude = parseFloat(longitude as string);
  return numLongitude >= -180 && numLongitude <= 180;
};

// Allow empty or valid altitude (should be a valid number)
export const validateAltitude = (altitude: string | null): boolean => {
  if (altitude === "" || altitude === null) return true; // Allow empty
  return !isNaN(parseFloat(altitude)) && isFinite(parseFloat(altitude));
};

// Validation for coordinates (latitude and longitude)
export const validateGpsCoordinates = (latitude: string, longitude: string): string[] => {
  const errors: string[] = [];
  if (latitude && !validateLatitude(latitude)) {
    errors.push("Latitude must be between -90 and 90.");
  }
  if (longitude && !validateLongitude(longitude)) {
    errors.push("Longitude must be between -180 and 180.");
  }
  return errors;
};

// Validation for altitude (optional but valid if provided)
export const validateAltitudeValue = (altitude: string | null): string[] => {
  const errors: string[] = [];
  if (altitude && !validateAltitude(altitude)) {
    errors.push("Altitude must be a valid number.");
  }
  return errors;
};
