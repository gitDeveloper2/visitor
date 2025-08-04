import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";

// Validation for User Comment (ensure it's a string, can be empty)
const userCommentSchema = z.string().optional();

// Encoding prefixes for EXIF User Comment
const ENCODING_PREFIXES = {
  ASCII: "\x41\x53\x43\x49\x49\x00\x00\x00", // ASCII Encoding
  UNICODE: "\x55\x4E\x49\x43\x4F\x44\x45\x00", // Unicode Encoding
  JIS: "\x4A\x49\x53\x00\x00\x00\x00\x00", // JIS Encoding
};

// Default encoding prefix to use
const DEFAULT_ENCODING = ENCODING_PREFIXES.ASCII;

export const UserCommentField: MetadataField = {
  key: "UserComment",
  label: "User Comment",
  type: "text",  // Text field for user comment
  validation: userCommentSchema,
  defaultValue: "",  // Default to empty string if no comment is provided
  functions: {
    // Transform to input format (if needed, for this case no transformation needed)
    toInput: (value) => {
      return value;  // Return the value as is, no special transformation
    },

    // Transform from input format back to EXIF format (ensure encoding)
    fromInput: (value: string) => {
      // Prepend the encoding prefix to the user comment
      return DEFAULT_ENCODING + value;
    },

    // Get the raw value from metadata and remove encoding prefix
    getRawValue: (metadata) => {
      const userComment = metadata["Exif"][piexif.ExifIFD.UserComment];
      
      if (!userComment) {
        return "";  // Return empty string if not found
      }

      // Remove the encoding prefix (if any) from the raw user comment
      const encodingKeys = Object.values(ENCODING_PREFIXES);
      for (const prefix of encodingKeys) {
        if (userComment.startsWith(prefix)) {
          return userComment.slice(prefix.length);  // Remove the prefix
        }
      }

      return userComment;  // Return as is if no prefix found
    },
  },
  exifKeys: {
    ifd: "Exif",
    exifKey: 37510,  // Key for UserComment in EXIF metadata
  },
};
