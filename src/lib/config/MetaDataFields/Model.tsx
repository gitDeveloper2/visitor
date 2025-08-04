import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation schema for Model (non-empty string)
const modelSchema = z.string().min(1, "Model is required");

export const ModelField: MetadataField = {
  key: "Model",
  label: "Model",
  type: "text", // Simple text field
  validation: modelSchema,
  defaultValue: "", // Default empty value
  functions: {
    getRawValue: (metadata) => metadata["0th"][piexif.ImageIFD.Model] || "", // Fetch 'Model' from raw metadata
  },
  exifKeys: { 
    ifd: "0th", 
    exifKey: 272 
  },
};
