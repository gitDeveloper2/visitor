import { z } from "zod";
import { MetadataField } from "../semanticKeyMapping";
// import FractionalInput from "@/app/components/customInputs/FractionInput";
import piexif from "piexifjs";
import FractionalInput from "@components/image2map/customInputs/FractionInput";
// Validation for the Exposure Time (as a fraction: numerator/denominator)
const exposureTimeSchema = z.string().refine((value) => {
    const parts = value.split("/");
    if (parts.length !== 2) return false;
    const [numerator, denominator] = parts.map(Number);
    return numerator > 0 && denominator > 0;
  }, {
    message: "Exposure time must be a valid fraction (e.g., 1/2000)"
  });
  export  const ExposureTimeField: MetadataField ={
    key: "ExposureTime",
    label: "Exposure Time",
    type: "custom",  // Custom field type for fractional input
    validation: exposureTimeSchema,
    defaultValue: "1/2000",  // Default fraction value for Exposure Time
    customComponent: FractionalInput,  // Custom component for fractional input
    functions: {
      // Transform to input format (split fraction into numerator and denominator)
      toInput: (value) => {
        
        // const [numerator, denominator] = value.split("/");
        // const result={ numerator: numerator || "", denominator: denominator || "" };
        // console.log("toInput out",result)
        return value
      },
      
      // Transform from input format back to fraction
      fromInput: (value: { numerator: string; denominator: string }) => {
          
              return value
      },
      getRawValue: (metadata) => {
        
       
        const exposureTime = metadata['Exif'][piexif.ExifIFD.ExposureTime];
       return exposureTime
      },
    },
   exifKeys:{ ifd: "Exif", exifKey: 33434 },
  }