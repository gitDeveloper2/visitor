import { z } from "zod";

import { MetadataField } from "../semanticKeyMapping";
import GpsExifConverter from "@components/image2map/GPSTestInput";
// import GpsExifConverter from "@/app/components/GPSTestInput";

export const GPSField: MetadataField = {
    key: "gps",
    label: "GPS Coordinates",
    type: "custom",
    validation: z
      .object({
        latitude: z.number().min(-90).max(90).nullable(),
        longitude: z.number().min(-180).max(180).nullable(),
        altitude: z.number().nullable(),
      })
      .nullable(),
    defaultValue: {
      latitude: null,
      longitude: null,
      altitude: null,
    },
    functions: {
      toInput: (value) => {
        return value
      },
      fromInput: (value) => {
        console.log("from in",typeof(value),value)
        // Check if value is a string (JSON string)
        if (typeof value === 'string') {
          try {
            
            return JSON.parse(value); // Parse JSON string into object
          } catch (e) {
            console.error('Invalid JSON string:', e);
            return null; // Or handle as needed
          }
        }
      
        // If value is already an object, return it as is
        if (typeof value === 'object' && value !== null) {
        

          return value; // No need to parse
        }
        

        // Return null or handle unexpected types
        return null;
      },
      
      getRawValue: (metadata) => {
        return metadata?.GPS
      },
    },
    customComponent: GpsExifConverter,
    exifKeys: {
      ifd: "GPS",
      exifKey: 2,
    },
  };
  
