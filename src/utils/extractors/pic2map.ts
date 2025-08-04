import fs from "fs";
import EXIF from "exif-js";
import sharp from 'sharp';
// import { ExifUpdates } from "../../types/ExifData";

/**
 * Utility function to update EXIF data and return the image for download.
 */

// Function to convert DMS (degrees, minutes, seconds) to decimal degrees
const convertDMSToDecimal = (dms: number[]): number => {
  const [degrees, minutes, seconds] = dms;
  return degrees + minutes / 60 + seconds / 3600;
};

export const extractExifData = (filePath: string): Promise<any> => {
  
  return new Promise((resolve, reject) => {
    try {
       
      const img = fs.readFileSync(filePath);
     
      // Attempt to read EXIF data
     
      const exifData = EXIF.readFromBinaryFile(img.buffer);
      
      // Handle case where no EXIF data is found
      if (!exifData || Object.keys(exifData).length === 0) {
        
        return resolve({
          hasExif: false,
          message: "No EXIF data found in the image.",
        });
      }

      // Construct metadata object
      const metadata = {
        hasExif: true,
        lat: null,
        lon: null,
        cameraMake: exifData?.Make || "Unknown",
        cameraModel: exifData?.Model || "Unknown",
        exposureTime: exifData?.ExposureTime
          ? `${exifData.ExposureTime}s`
          : "Unknown",
        fNumber: exifData?.FNumber ? `f/${exifData.FNumber}` : "Unknown",
        focalLength: exifData?.FocalLength
          ? `${exifData.FocalLength}mm`
          : "Unknown",
        dateTime: exifData?.DateTimeOriginal || "Unknown",
        orientation: exifData?.Orientation || "Unknown",
        exifData: exifData,
      };

      // Extract GPS data if available
      if (exifData?.GPSLatitude && exifData?.GPSLongitude) {
        let lat = convertDMSToDecimal(exifData.GPSLatitude);
        let lon = convertDMSToDecimal(exifData.GPSLongitude);

        // Adjust latitude and longitude based on their reference
        if (exifData.GPSLatitudeRef === "S") lat *= -1;
        if (exifData.GPSLongitudeRef === "W") lon *= -1;

        metadata.lat = lat;
        metadata.lon = lon;
      } else {
      }

      resolve(metadata);
    } catch (error) {
      reject({ hasExif: false, message: "Error reading EXIF data.", error });
    }
  });
};








interface ExifUpdates {
  ImageDescription?: string;
  Artist?: string;
  Copyright?: string;
}

export const updateExifDataAndReturnImage = async (
  filePath: string,
  exifUpdates: ExifUpdates,
  fileName: string
): Promise<Buffer | undefined> => {
  try {
   

    // Check if file exists
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      console.error("File does not exist:", filePath);
      return;
    }
    try {
      fs.accessSync(filePath, fs.constants.W_OK);
    } catch (err) {
      console.error("No write permission for file:", filePath);
      return;
    }

    // Define metadata only with properties supported by sharp
    const metadata = {
      description: exifUpdates.ImageDescription || "Default Description",
      artist: exifUpdates.Artist || "Default Artist",
      copyright: exifUpdates.Copyright || "Default Copyright",
    };

   
    
    const buffer = await sharp(filePath)
      .withMetadata({
        exif: {
          IFD0: {
            ImageDescription: metadata.description,
            Artist: metadata.artist,
            Copyright: metadata.copyright,
          },
        },
      })
      .toBuffer();

    

    // Read the updated image buffer
    return buffer;
  } catch (error) {
    console.error("Error processing EXIF data:", error);
    throw new Error(`Error processing EXIF data: ${error}`);
  }
};




// export const updateExifDataAndReturnImage = async (
//   filePath: string,
//   exifUpdates: ExifUpdates,
//   fileName: string
// ): Promise<Buffer | undefined> => {
//   try {
//     console.log("entry");

//     // Check if file exists
//     const fileExists = fs.existsSync(filePath);
//     if (!fileExists) {
//       console.error("File does not exist:", filePath);
//       return;
//     }
//     try {
//       fs.accessSync(filePath, fs.constants.W_OK);
//     } catch (err) {
//       console.error("No write permission for file:", filePath);
//       return;
//     }

//     // Define metadata only with properties supported by sharp
//     const metadata = {
//       description: exifUpdates.ImageDescription || "Default Description",
//       artist: exifUpdates.Artist || "Default Artist",
//       copyright: exifUpdates.Copyright || "Default Copyright",
//     };

//     // Write EXIF metadata to the image using sharp
//     console.log("Writing EXIF data at path ...", filePath);
//     console.log(metadata);
    
//     const buffer = await sharp(filePath)
//       .withMetadata({
//         exif: {
//           IFD0: {
//             ImageDescription: metadata.description,
//             Artist: metadata.artist,
//             Copyright: metadata.copyright,
//           },
//           // Only include supported metadata properties
//         },
//       })
//       .toBuffer();

//     console.log("EXIF data written successfully");

//     // Clean up (delete temporary file if needed)
//     // await fs.promises.unlink(filePath);
//     console.log("Temporary file deleted");

//     return buffer;
//   } catch (error) {
//     console.error("Error processing EXIF data:", error);
//     throw new Error(`Error processing EXIF data: ${error}`);
//   }
// };



export interface ExifData {
  hasExif: boolean;
  message?: string;
  lat: number | null;
  lon: number | null;
  cameraMake: string;
  cameraModel: string;
  exposureTime: string | "Unknown";
  fNumber: string | "Unknown";
  focalLength: string | "Unknown";
  dateTime: string | "Unknown";
  orientation: number | "Unknown";
  exifData: any; // Original EXIF data
}
