import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation for Software field (ensure it's a non-empty string)
const softwareSchema = z.string().min(1, "Software name is required");

export const SoftwareField: MetadataField = {
  key: "Software",
  label: "Software",
  type: "text",  // Text input for software name
  validation: softwareSchema,
  defaultValue: "Unknown",  // Default value if software is not found
  functions: {
    // Extract raw Software value from metadata
    getRawValue: (metadata) => {
      const software = metadata["0th"][piexif.ImageIFD.Software];
      return software || "Unknown";  // Default to "Unknown" if not found
    },
  },
  exifKeys: { 
    ifd: "0th", 
    exifKey: 305 
  },
};
