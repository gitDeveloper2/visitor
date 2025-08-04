import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation for ISO Speed Ratings (positive integer)
const isoSpeedSchema = z.number().min(1, "ISO must be a positive integer");

export const ISOSpeedField: MetadataField = {
  key: "ISOSpeed",
  label: "ISO Speed Ratings",
  type: "number", // ISO is a number
  validation: isoSpeedSchema,
  defaultValue: 100, // Default ISO value
  functions: {
    getRawValue: (metadata) => metadata["Exif"][piexif.ExifIFD.ISOSpeedRatings] || 100, // Fetch ISO Speed from metadata
  },
  exifKeys: { 
    ifd: "Exif", 
    exifKey: 34855 
  },
};
