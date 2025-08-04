import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation for GPS Altitude (must be a number, including positive or negative values)
const gpsAltitudeSchema = z.number().optional();  // Altitude can be omitted, hence optional

export const GPSAltitudeField: MetadataField = {
  key: "GPSAltitude",
  label: "GPS Altitude",
  type: "number",  // GPS Altitude is a numeric value (in meters)
  validation: gpsAltitudeSchema,
  defaultValue: 0,  // Default to 0 (sea level) if no GPS altitude is provided
  functions: {
    // Extract raw GPS Altitude value from metadata
    getRawValue: (metadata) => {
      const gpsAltitude = metadata["GPS"]?.[piexif.GPSIFD.GPSAltitude];
      return gpsAltitude ? gpsAltitude[0] / gpsAltitude[1] : 0;  // Convert to decimal
    },
  },
  exifKeys: { 
    ifd: "GPS", 
    exifKey: 6 
  },
};
