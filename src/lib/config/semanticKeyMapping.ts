import { z } from 'zod';
import { MakeField } from "./MetaDataFields/Make";
import { ExposureTimeField } from "./MetaDataFields/exposureTime";
import { ModelField } from "./MetaDataFields/Model";
import { DateTimeField } from "./MetaDataFields/DateTime Field";
import { SoftwareField } from "./MetaDataFields/Software";
import { UserCommentField } from "./MetaDataFields/UserComments";
import { GPSField } from './MetaDataFields/GPXField';

export interface MetadataField {
  key: string;  // Unique identifier for the field
  label: string;  // Display label for the field
  type: "number" | "text" | "select" | "date" | "datetime-local" | "custom";  // Field type (text, number, etc.)
  validation: z.ZodTypeAny;  // Zod schema for field validation

  // Optional default value for the field
  defaultValue?: any;  // Default value to simplify the initialization

  // Functions for transforming the data
  functions?: {
    toInput?: (value: any) => any;  // Optional transformation for converting data to input format
    fromInput?: (value: any) => any;  // Optional transformation for converting input back to data format
    getRawValue?: (metadata: any) => any;  // Function to extract field value from raw metadata
  };

  // Optional options for select fields (dropdown options)
  options?: Array<{ value: string | number; label: string }>;

  // Custom component for the field (for custom input types)
  customComponent?: React.ComponentType<any>;  // Reusable custom component to render the field

  // Field-specific configuration (if any)
  config?: Record<string, any>;  // Any additional configuration specific to a field
  exifKeys:{
     ifd: string;
      exifKey:number; 
  }

}








// Metadata field configuration with Make and Exposure Time
const metadataSchema: MetadataField[] = [
  MakeField,
  // ExposureTimeField,
  ModelField,
  DateTimeField,
  SoftwareField,
  UserCommentField,
  GPSField
  
];


export default metadataSchema;

  export const reconstructExifData = (updatedMetadata: Record<string, any>) => {
    const exifObj: any = { "0th": {}, "Exif": {}, "GPS": {}, "1st": {} }; // Initialize EXIF structure
  
    metadataSchema.forEach((field) => {
      const { exifKeys, functions, key } = field;
  
      if (exifKeys && updatedMetadata[key] !== undefined) {
        const { ifd, exifKey } = exifKeys;
  
        // Transform value using fromInput function (if available)
        let value = updatedMetadata[key];
        // if (functions?.fromInput) {
        //   value = functions.fromInput(value);
        // }
  
        // Handle IFD initialization
        if (!exifObj[ifd]) {
          exifObj[ifd] = {};
        }
  
        // Assign the value to the appropriate EXIF key
        exifObj[ifd][exifKey] = value;
      }
    });
    const gpsFix=exifObj.GPS[2]

    exifObj.GPS=gpsFix

    return exifObj;
  };
  