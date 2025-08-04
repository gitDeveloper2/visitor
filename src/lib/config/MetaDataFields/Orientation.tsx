import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation for Orientation (must be between 1 and 8)
const orientationSchema = z.number().min(1).max(8, "Orientation must be between 1 and 8");

export const OrientationField: MetadataField = {
  key: "Orientation",
  label: "Orientation",
  type: "select",  // Change to 'select' type for a dropdown
  validation: orientationSchema,
  defaultValue: 1,
  options: [
    { value: 1, label: "Normal (0°)" },
    { value: 2, label: "Flipped horizontally" },
    { value: 3, label: "Rotated 180°" },
    { value: 4, label: "Flipped vertically" },
    { value: 5, label: "Rotated 90° counterclockwise and flipped horizontally" },
    { value: 6, label: "Rotated 90° counterclockwise" },
    { value: 7, label: "Rotated 90° clockwise and flipped horizontally" },
    { value: 8, label: "Rotated 90° clockwise" },
  ],
  functions: {
    getRawValue: (metadata) => {
      const orientation = metadata["0th"][piexif.ImageIFD.Orientation];
      return orientation || 1;
    },
  },
  exifKeys: { 
    ifd: "0th", 
    exifKey: 274 
  },
};

