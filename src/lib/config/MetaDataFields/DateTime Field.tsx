import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation schema for DateTime (ensure it's a valid datetime-local format)
const dateTimeSchema = z.string().refine((value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());  // Validates if it's a proper date format
}, {
  message: "Date and Time must be a valid format (e.g., YYYY-MM-DDTHH:MM:SS)"
});

export const DateTimeField: MetadataField = {
  key: "DateTime",
  label: "Date and Time",
  type: "datetime-local",  // Use HTML5 datetime-local input
  validation: dateTimeSchema,
  defaultValue: new Date().toISOString().slice(0, 19),  // Default to current date-time
  functions: {
    // Extract the DateTime value from metadata
    getRawValue: (metadata) => {
      const dateTime = metadata["0th"][piexif.ImageIFD.DateTime];
      return dateTime || new Date().toISOString().slice(0, 19);  // Return current time if not found
    },
  },
  exifKeys: { 
    ifd: "0th", 
    exifKey: 306 
  },
};
