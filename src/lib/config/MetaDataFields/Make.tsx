import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";
// Validation for the Make field (just a non-empty string for simplicity)
const makeSchema = z.string().min(1, "Make is required");
export const MakeField: MetadataField ={
    key: "Make",
    label: "Make",
    type: "text",  // Simple text field
    validation: makeSchema,
    defaultValue: "",  // Default empty value for Make
    functions: {
      getRawValue: (metadata) => metadata['0th'][piexif.ImageIFD.Make] || "",  // Fetch 'Make' from raw metadata
    },
    exifKeys:{ ifd: "0th", exifKey: 271 }
  }

