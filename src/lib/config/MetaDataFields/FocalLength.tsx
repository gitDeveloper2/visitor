import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
// import FractionalInput from "@/app/components/customInputs/FractionInput";  // Assuming you have the custom component
import piexif from "piexifjs";
import FractionalInput from "@components/image2map/customInputs/FractionInput";

// Validation for Focal Length (must be a valid fraction, e.g., 50/1)
const focalLengthSchema = z.string().refine((value) => {
  const parts = value.split("/");
  if (parts.length !== 2) return false;
  const [numerator, denominator] = parts.map(Number);
  return numerator > 0 && denominator > 0;
}, {
  message: "Focal length must be a valid fraction (e.g., 50/1)"
});

export const FocalLengthField: MetadataField = {
  key: "FocalLength",
  label: "Focal Length",
  type: "custom",  // Custom field type for fractional input
  validation: focalLengthSchema,
  defaultValue: "50/1",  // Default fraction value for focal length (50mm)
  customComponent: FractionalInput,  // Custom component for fractional input
  functions: {
    // Convert raw focal length to input format (numerator and denominator)
    toInput: (value) => {
      if (!value) return { numerator: 50, denominator: 1 };  // Default to 50mm
      const [numerator, denominator] = value.split("/");
      return { numerator, denominator };
    },
    // Convert input format back to fraction (numerator/denominator)
    fromInput: (value) => {
      const [numerator, denominator] = value.split("/").map(Number);
      return `${numerator}/${denominator}`;
    },
    // Extract raw focal length from metadata
    getRawValue: (metadata) => {
      const focalLength = metadata["Exif"][piexif.ExifIFD.FocalLength];
      if (focalLength) {
        return `${focalLength[0]}/${focalLength[1]}`;  // Return as fraction
      }
      return "50/1";  // Default value
    },
  },
  exifKeys: { 
    ifd: "Exif", 
    exifKey: 37386 
  },
};
