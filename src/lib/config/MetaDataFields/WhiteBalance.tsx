import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// White Balance options (Auto, Manual, etc.)
const whiteBalanceOptions = [
  { value: 0, label: "Auto" },
  { value: 1, label: "Manual" },
  { value: 2, label: "Daylight" },
  { value: 3, label: "Cloudy" },
  { value: 4, label: "Tungsten" },
  { value: 5, label: "Fluorescent" },
  { value: 6, label: "Flash" },
];

// Validation for White Balance (must be one of the options)
const whiteBalanceSchema = z.number().refine((value) => whiteBalanceOptions.some(option => option.value === value), {
  message: "Invalid White Balance value"
});

export const WhiteBalanceField: MetadataField = {
  key: "WhiteBalance",
  label: "White Balance",
  type: "select",  // Dropdown for White Balance
  validation: whiteBalanceSchema,
  defaultValue: 0,  // Default to "Auto" (0)
  options: whiteBalanceOptions,  // Dropdown options
  functions: {
    // Extract raw White Balance value from metadata
    getRawValue: (metadata) => {
      const whiteBalance = metadata["Exif"][piexif.ExifIFD.WhiteBalance];
      return whiteBalance || 0;  // Default to 0 (Auto) if not found
    },
  },
  exifKeys: { 
    ifd: "Exif", 
    exifKey: 41987 
  },
};
