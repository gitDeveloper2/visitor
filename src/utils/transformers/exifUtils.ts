export type ExifDMS = [[number, number], [number, number], [number, number]];
export type ExifGps = {
  0: [number, number, number, number]; // GPS Version
  1?: "N" | "S"; // Latitude reference
  2?: ExifDMS; // Latitude in DMS
  3?: "E" | "W"; // Longitude reference
  4?: ExifDMS; // Longitude in DMS
  6?: [number, number]; // Altitude as fraction
  5?: 0 | 1; // Altitude reference (0 = above sea level, 1 = below sea level)

};

export const decimalToExifDms = (decimal: number): ExifDMS => {
  const absValue = Math.abs(decimal);
  const degrees = Math.floor(absValue);
  const minutes = Math.floor((absValue - degrees) * 60);
  const seconds = (absValue - degrees - minutes / 60) * 3600;

  return [
    [degrees, 1],
    [minutes, 1],
    [Math.round(seconds * 1000), 1000], // Scale seconds to 3 decimal places
  ];
};

export const decimalToGpsExif = (latitude?: number, longitude?: number, altitude?: number): Partial<ExifGps> => {
  const exifGps: Partial<ExifGps> = {
    0: [2, 3, 0, 0], // GPS Version
  };

  if (latitude !== undefined) {
    exifGps[1] = latitude >= 0 ? "N" : "S"; // Latitude reference
    exifGps[2] = decimalToExifDms(latitude); // Latitude in DMS
  }
  
  if (longitude !== undefined) {
    exifGps[3] = longitude >= 0 ? "E" : "W"; // Longitude reference
    exifGps[4] = decimalToExifDms(longitude); // Longitude in DMS
  }

  if (altitude !== undefined) {
    const altitudeReference = altitude >= 0 ? 0 : 1;  // 0 for above sea level, 1 for below sea level
    exifGps[6] = [Math.abs(altitude), 1]; // Altitude as a fraction (always positive)
    exifGps[5] = altitudeReference; // Set altitude reference (0 or 1)
  }

  return exifGps; 
};


export const exifDmsToDecimal = (dms: ExifDMS, ref: "N" | "S" | "E" | "W"): number => {
  const degrees = dms[0][0] / dms[0][1];
  const minutes = dms[1][0] / dms[1][1] / 60;
  const seconds = dms[2][0] / dms[2][1] / 3600;

  const decimal = degrees + minutes + seconds;
  return ref === "S" || ref === "W" ? -decimal : decimal;
};

export const parseExifGpsData = (exifData: any): { latitude?: number; longitude?: number; altitude?: number; isBelowSeaLevel?: boolean } | null => {
  try {
    const gpsLatitude = exifData["2"];
    const gpsLongitude = exifData["4"];
    const latRef = exifData["1"] as "N" | "S";
    const longRef = exifData["3"] as "E" | "W";

    // Swap the altitude and reference
    const gpsAltitude = exifData["6"] ? exifData["6"][0] / exifData["6"][1] : undefined; // Altitude from index 6
    const altitudeRef = exifData["5"]; // Altitude reference from index 5 (0 = above sea level, 1 = below sea level)

    const latitude = gpsLatitude ? exifDmsToDecimal(gpsLatitude, latRef) : undefined;
    const longitude = gpsLongitude ? exifDmsToDecimal(gpsLongitude, longRef) : undefined;

    return { 
      latitude, 
      longitude, 
      altitude: gpsAltitude, 
      isBelowSeaLevel: altitudeRef === 1 // True if below sea level
    };
  } catch (error) {
    console.error("Error parsing EXIF GPS data:", error);
    return null;
  }
};


