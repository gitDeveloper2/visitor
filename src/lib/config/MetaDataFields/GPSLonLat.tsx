import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
import piexif from "piexifjs";
import GPSInput from "@components/image2map/customInputs/GPSInput";
// import GPSInput from "@/app/components/customInputs/GPSInput";

// Validation schema for Latitude (between -90 and 90)
const latitudeSchema = z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90");

// Validation schema for Longitude (between -180 and 180)
const longitudeSchema = z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180");

export const GPSLatitudeField: MetadataField = {
  key: "GPSLatitude",
  label: "GPS Latitude",
  type: "custom",  // Custom input type using GPSInput
  validation: z.string().min(1, "Latitude is required"), // Validation for input
  defaultValue: "",
  customComponent: GPSInput,  // Use the custom GPS input component
  functions: {
    getRawValue: (metadata) => {
      // Convert GPS data from raw EXIF metadata to DMS string for display
      const gpsLatitude = metadata["GPS"]?.[piexif.GPSIFD.GPSLatitude];
      if (gpsLatitude && gpsLatitude.length === 3) {
        const [deg, min, sec] = gpsLatitude;
        return `${deg}° ${min}' ${sec}" N`;
      }
      return ""; // Return empty string if no data found
    },
    toInput: (value) => {
      if (Array.isArray(value) && value.length === 3) {
        const degrees = value[0][0] / value[0][1];
        const minutes = value[1][0] / value[1][1];
        const seconds = value[2][0] / value[2][1];
        return `${degrees}° ${minutes}' ${seconds.toFixed(2)}"`;
      }
      return ""; // Return an empty string if the format is invalid
    },
    
    fromInput: (value) => {
      if (typeof value !== "string") {
        console.error("Expected string input for GPS data, got:", value);
        return null;
      }
    
      const parts = value.split(" ");
      if (parts.length === 4) {
        const degrees = parseFloat(parts[0].replace("°", "")) || 0;
        const minutes = parseFloat(parts[1].replace("'", "")) || 0;
        const seconds = parseFloat(parts[2].replace('"', "")) || 0;
        const direction = parts[3];
    
        const result={
          value: [
            [degrees, 1],
            [minutes, 1],
            [Math.round(seconds * 100), 100] // Scale seconds to rational
          ],
          ref: direction
        };
        return result
      }
    
      console.error("Invalid GPS input format:", value);
      return null;
    },
    
    
    
    
  },
  exifKeys: { ifd: "GPS", exifKey: 2 },  // GPSLatitude EXIF tag
};


export const GPSLongitudeField: MetadataField = {
  key: "GPSLongitude",
  label: "GPS Longitude",
  type: "custom",  // Custom input type using GPSInput
  validation: z.string().min(1, "Longitude is required"),
  defaultValue: "",
  customComponent: GPSInput,  // Custom GPS input component
  functions: {
    getRawValue: (metadata) => {
      const gpsLongitude = metadata["GPS"]?.[piexif.GPSIFD.GPSLongitude];
      if (gpsLongitude && gpsLongitude.length === 3) {
        const [deg, min, sec] = gpsLongitude;
        return `${deg}° ${min}' ${sec}" E`;  // Convert to DMS format for display
      }
      return ""; // Return empty string if no value found
    },
    toInput: (value) => {
      const parts = value.split(" ");
      if (parts.length === 4) {
        const deg = parseFloat(parts[0].replace("°", ""));
        const min = parseFloat(parts[1].replace("'", ""));
        const sec = parseFloat(parts[2].replace('"', ""));
        const direction = parts[3];
        let decimalValue = deg + min / 60 + sec / 3600;
        if (direction === "W") {
          decimalValue = -decimalValue;  // West longitude is negative
        }
        return decimalValue.toString();
      }
      return "";  // Return empty string if format is wrong
    },
    fromInput: (value) => {
      const decimal = parseFloat(value);
      const degrees = Math.floor(decimal);
      const minutes = Math.floor((decimal - degrees) * 60);
      const seconds = ((decimal - degrees - minutes / 60) * 3600).toFixed(2);
      const direction = decimal < 0 ? "W" : "E";
      return `${degrees}° ${minutes}' ${seconds}" ${direction}`;  // Return DMS format
    },
  },
  exifKeys: { ifd: "GPS", exifKey: 4 },  // GPSLongitude EXIF tag
};


export const GPSAltitudeField: MetadataField = {
  key: "GPSAltitude",
  label: "GPS Altitude",
  type: "text",
  validation: z.string().optional(),
  defaultValue: "",
  functions: {
    getRawValue: (metadata) => {
      const gpsAltitude = metadata["GPS"]?.[piexif.GPSIFD.GPSAltitude];
      return gpsAltitude ? gpsAltitude.toString() : "";
    },
    toInput: (value) => value,  // Direct conversion to string
    fromInput: (value) => value,  // Direct conversion from input
  },
  exifKeys: { ifd: "GPS", exifKey: 6 },  // GPSAltitude tag
};
