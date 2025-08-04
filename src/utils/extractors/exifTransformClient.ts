import piexif from "piexifjs";
import { Exif, ExifData } from "../../types/ExifData";

export const transformExifData = (input: ExifData) => {
    // Extract the original EXIF data
    const originalExif = input.exifData || {};
  
    // Create a new object that contains the original EXIF data enriched with new fields
    const updatedExifData = {
      ...originalExif,
      // Update or add new fields with the provided metadata
      Make: input.cameraMake || originalExif.Make || 'Unknown',
      Model: input.cameraModel || originalExif.Model || 'Unknown',
      ExposureTime: input.exposureTime || originalExif.ExposureTime || 'Unknown',
      FNumber: input.fNumber || originalExif.FNumber || 'Unknown',
      FocalLength: input.focalLength || originalExif.FocalLength || 'Unknown',
      DateTimeOriginal: input.dateTime || originalExif.DateTimeOriginal || 'Unknown',
      Orientation: input.orientation || originalExif.Orientation || 'Unknown',
      // GPS coordinates (if provided)
      GPSLatitude: input.lat != null ? input.lat : originalExif.GPSLatitude,
      GPSLongitude: input.lon != null ? input.lon : originalExif.GPSLongitude,
      GPSLatitudeRef: input.lat && input.lat > 0 ? 'N' : 'S',
      GPSLongitudeRef: input.lon && input.lon > 0 ? 'E' : 'W',
    };
  
    // If EXIF data is missing, set hasExif to false
    const hasExif = !!input.exifData;
  
    // Return the updated EXIF data
    return { exifData: updatedExifData}  // Full updated EXIF data
   
  };
  




  export function mapExifData(piexifData: Record<string, any>): Exif {
    const { "0th": zeroth, Exif: exif, GPS: gps, "1st": first } = piexifData;
 // Helper function to decode altitude
 // Helper function to clean and decode the user comment
const cleanAndDecodeUserComment = (comment: string): string => {
  // Remove any leading or trailing ASCII null characters (\u0000)
  const cleanedComment = comment.replace(/\u0000/g, '').trim();
  
  // Check if it's a valid UTF-8 encoded string
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const decoded = decoder.decode(new TextEncoder().encode(cleanedComment));
    return decoded;
  } catch (e) {
    // If decoding fails, return the cleaned comment as is (likely ASCII)
    return cleanedComment;
  }
};
const decodeAltitude = (altitude: any[], altitudeRef: number): number | undefined => {
  if (!altitude || altitude.length < 2) {
    return undefined;
  }

  // Decode the altitude fraction: [numerator, denominator]
  const decodedAltitude = altitude[0] / altitude[1];
  
  // If the altitude reference is 1, it means below sea level, so we invert the value
  return altitudeRef === 1 ? -decodedAltitude : decodedAltitude;
};
    const decodeCoordinate = (coordinate: any[], ref: string): number | undefined => {
      if (!coordinate || coordinate.length < 3) {
        return undefined;
      }
    
      // Extract the degree, minutes, and seconds parts
      const [degreePart, minutePart, secondPart] = coordinate;
    
      // Convert the fractional seconds (e.g., [29640, 1000] => 29.64)
      const seconds = secondPart[0] / secondPart[1]; 
    
      // Convert to decimal
      const decimal = degreePart[0] + (minutePart[0] / minutePart[1]) / 60 + seconds / 3600;
    
      // Log the computed decimal and reference
    
      // Apply negative sign for South or West directions
      if (ref === "S" || ref === "W") {
        return -decimal;
      }
      
      return decimal;
    };

  
    return {
      image: {
        make: zeroth?.[piexif.ImageIFD.Make],
        model: zeroth?.[piexif.ImageIFD.Model],
        xResolution: zeroth?.[piexif.ImageIFD.XResolution],
        yResolution: zeroth?.[piexif.ImageIFD.YResolution],
        resolutionUnit: zeroth?.[piexif.ImageIFD.ResolutionUnit],
        software: zeroth?.[piexif.ImageIFD.Software],
        dateTime: zeroth?.[piexif.ImageIFD.DateTime],
      },
      cameraSettings: {
        exposureTime: exif?.[piexif.ExifIFD.ExposureTime],
        fNumber: exif?.[piexif.ExifIFD.FNumber],
        isoSpeedRatings: exif?.[piexif.ExifIFD.ISOSpeedRatings]
          ? [exif[piexif.ExifIFD.ISOSpeedRatings]]
          : undefined,
        shutterSpeedValue: exif?.[piexif.ExifIFD.ShutterSpeedValue],
        apertureValue: exif?.[piexif.ExifIFD.ApertureValue],
        brightnessValue: exif?.[piexif.ExifIFD.BrightnessValue],
        exposureBiasValue: exif?.[piexif.ExifIFD.ExposureBiasValue],
        maxApertureValue: exif?.[piexif.ExifIFD.MaxApertureValue],
        meteringMode: exif?.[piexif.ExifIFD.MeteringMode],
        flash: exif?.[piexif.ExifIFD.Flash],
        focalLength: exif?.[piexif.ExifIFD.FocalLength],
        focalLengthIn35mmFilm: exif?.[piexif.ExifIFD.FocalLengthIn35mmFilm],
      },
      gps: {
        latitude: decodeCoordinate(gps?.[2], gps?.[1]), // Latitude
        longitude: decodeCoordinate(gps?.[4], gps?.[3]), 
        altitude: decodeAltitude(gps?.[6], gps?.[5]), // Altitude
        latitudeRef: gps?.[1],
      longitudeRef: gps?.[3],
      altitudeRef: gps?.[5], // Altitude reference (0 = sea level, 1 = below sea level)
        gpsTimeStamp: gps?.[piexif.GPSIFD.GPSTimeStamp]?.join(":"),
        gpsDateStamp: gps?.[piexif.GPSIFD.GPSDateStamp],
      },
      additionalTags: {
        artist: zeroth?.[piexif.ImageIFD.Artist],
        copyright: zeroth?.[piexif.ImageIFD.Copyright],
        userComment: exif?.[piexif.ExifIFD.UserComment] 
        ? cleanAndDecodeUserComment(exif[piexif.ExifIFD.UserComment]) 
        : undefined,        subSecTime: exif?.[piexif.ExifIFD.SubSecTime],
        subSecTimeOriginal: exif?.[piexif.ExifIFD.SubSecTimeOriginal],
        subSecTimeDigitized: exif?.[piexif.ExifIFD.SubSecTimeDigitized],
        colorSpace: exif?.[piexif.ExifIFD.ColorSpace],
        pixelXDimension: exif?.[piexif.ExifIFD.PixelXDimension],
        pixelYDimension: exif?.[piexif.ExifIFD.PixelYDimension],
      },
      thumbnail: {
        compression: first?.[piexif.ImageIFD.Compression],
        xResolution: first?.[piexif.ImageIFD.XResolution],
        yResolution: first?.[piexif.ImageIFD.YResolution],
        resolutionUnit: first?.[piexif.ImageIFD.ResolutionUnit],
      },
      meta: {
        hasExif: true,
        message: 'okay',
      },
    };
  }
  
