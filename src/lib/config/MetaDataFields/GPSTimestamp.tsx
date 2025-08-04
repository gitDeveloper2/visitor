import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation for GPS TimeStamp (must be a string in HH:MM:SS format)
const gpsTimeStampSchema = z.string().refine((value) => {
  const regex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
  return regex.test(value);
}, {
  message: "Time must be in the format HH:MM:SS"
});

export const GPSTimeStampField: MetadataField = {
  key: "GPSTimeStamp",
  label: "GPS TimeStamp",
  type: "text",  // TimeStamp is a string (HH:MM:SS)
  validation: gpsTimeStampSchema,
  defaultValue: "",  // Default to empty string if no GPS timestamp is available
  functions: {
    // Extract raw GPS TimeStamp value from metadata
    getRawValue: (metadata) => {
      const gpsTimeStamp = metadata["GPS"]?.[piexif.GPSIFD.GPSTimeStamp];
      return gpsTimeStamp ? gpsTimeStamp.join(":") : "";  // Join components (HH:MM:SS)
    },
  },
  exifKeys: { 
    ifd: "GPS", 
    exifKey: 29 
  },
};
