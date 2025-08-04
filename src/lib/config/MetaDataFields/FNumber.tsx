import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
// import FractionalInput from "@/app/components/customInputs/FractionInput";  // Assuming you have the custom component
import piexif from "piexifjs";
import FractionalInput from "@components/image2map/customInputs/FractionInput";

// Validation for Aperture (must be a valid fraction, e.g., 28/10 for f/2.8)
const apertureSchema = z.string().refine((value) => {
  const parts = value.split("/");
  if (parts.length !== 2) return false;
  const [numerator, denominator] = parts.map(Number);
  return numerator > 0 && denominator > 0;
}, {
  message: "Aperture (f-number) must be a valid fraction (e.g., 28/10 for f/2.8)"
});

export const ApertureField: MetadataField = {
  key: "Aperture",
  label: "Aperture (F-Number)",
  type: "custom",  // Custom field type for fractional input
  validation: apertureSchema,
  defaultValue: "28/10",  // Default fraction value for f/2.8
  customComponent: FractionalInput,  // Custom component for fractional input
  functions: {
    // Convert raw aperture value to input format (numerator and denominator)
    toInput: (value) => {
      if (!value) return { numerator: 28, denominator: 10 };  // Default to f/2.8
      const [numerator, denominator] = value.split("/");
      return { numerator, denominator };
    },
    // Convert input format back to fraction (numerator/denominator)
    fromInput: (value) => {
      const [numerator, denominator] = value.split("/").map(Number);
      return `${numerator}/${denominator}`;
    },
    // Extract raw aperture value from metadata
    getRawValue: (metadata) => {
      const aperture = metadata["Exif"][piexif.ExifIFD.FNumber];
      if (aperture) {
        return `${aperture[0]}/${aperture[1]}`;  // Return as fraction
      }
      return "28/10";  // Default value for f/2.8
    },
  },
  exifKeys: { 
    ifd: "Exif", 
    exifKey: 33437 
  },
};
