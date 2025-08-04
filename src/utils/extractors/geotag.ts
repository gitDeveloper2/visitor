import { decimalToGpsExif } from "../transformers/exifUtils";

export const convertCoordinatesToExif = (
    coordinates: string
  ) => {
    const [latitudeStr, longitudeStr] = coordinates.split(",").map((value) => value.trim());
  
    // Process the EXIF data
    return JSON.stringify(decimalToGpsExif(parseFloat(latitudeStr), parseFloat(longitudeStr)), null, 2);
  };