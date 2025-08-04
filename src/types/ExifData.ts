import { ApiResponse } from "./apiResponse";

export interface ExifData {
  hasExif: boolean; // Indicates whether EXIF data is available
  message?: string; // Message to describe issues or status (optional)
  lat: number | null; // Latitude from GPS data (can be null if not available)
  lon: number | null; // Longitude from GPS data (can be null if not available)
  cameraMake: string; // Camera manufacturer (e.g., "Canon")
  cameraModel: string; // Camera model (e.g., "EOS 80D")
  exposureTime: string | 'Unknown'; // Exposure time (e.g., "1/500")
  fNumber: string | 'Unknown'; // F-number (e.g., "f/2.8")
  focalLength: string | 'Unknown'; // Focal length (e.g., "50mm")
  dateTime: string | 'Unknown'; // Date and time when the photo was taken (e.g., "2024:03:15 14:30:00")
  orientation: number | 'Unknown'; // Image orientation (e.g., 1 for normal orientation)
  exifData: any; // Full EXIF data, can be used for further inspection
}
export interface ExifApiResponse extends ApiResponse<ExifData> {}
export interface ExifUpdates {
  ImageDescription?: string;
  Artist?: string;
  Copyright?: string;
  XResolution?: number;
  YResolution?: number;
  ResolutionUnit?: number;
  YCbCrPositioning?: number;
  GPSInfoIFDPointer?: number;
  GPSVersionID?: string;
  GPSLatitudeRef?: string;
  GPSLatitude?: number;
  GPSLongitudeRef?: string;
  GPSLongitude?: number;
  thumbnail?: object;
  Make?: string;
  Model?: string;
  ExposureTime?: string;
  FNumber?: string;
  FocalLength?: string;
  DateTimeOriginal?: string;
  Orientation?: string;
}


export type Exif = {
  image: {
    make?: string; // Camera manufacturer
    model?: string; // Camera model
    xResolution?: number; // Horizontal resolution
    yResolution?: number; // Vertical resolution
    resolutionUnit?: string; // Unit for resolution (e.g., "inches")
    software?: string; // Software used to process the image
    dateTime?: string; // Last modified date and time
  };
  cameraSettings: {
    exposureTime?: number; // Exposure time in seconds
    fNumber?: number; // Aperture value
    isoSpeedRatings?: number[]; // ISO speed
    shutterSpeedValue?: number; // Shutter speed
    apertureValue?: number; // Lens aperture
    brightnessValue?: number; // Brightness
    exposureBiasValue?: number; // Exposure bias
    maxApertureValue?: number; // Maximum lens aperture
    meteringMode?: string; // Metering mode (e.g., "average")
    flash?: string; // Flash status
    focalLength?: number; // Focal length of the lens
    focalLengthIn35mmFilm?: number; // Focal length for 35mm film equivalency
  };
  gps: {
    latitude?: number; // Latitude
    longitude?: number; // Longitude
    altitude?: number; // Altitude
    latitudeRef?: "N" | "S"; // Latitude reference (North/South)
    longitudeRef?: "E" | "W"; // Longitude reference (East/West)
    altitudeRef?: 0 | 1; // Altitude reference (0 = sea level, 1 = below sea level)
    gpsTimeStamp?: string; // GPS timestamp
    gpsDateStamp?: string; // GPS date
  };
  additionalTags: {
    artist?: string; // Artist or creator
    copyright?: string; // Copyright information
    userComment?: string; // User comments
    subSecTime?: string; // Subsecond time
    subSecTimeOriginal?: string; // Subsecond original time
    subSecTimeDigitized?: string; // Subsecond digitized time
    colorSpace?: string; // Color space information
    pixelXDimension?: number; // Valid width of the meaningful image
    pixelYDimension?: number; // Valid height of the meaningful image
  };
  thumbnail?: {
    compression?: string; // Compression scheme used for thumbnail
    xResolution?: number; // Thumbnail horizontal resolution
    yResolution?: number; // Thumbnail vertical resolution
    resolutionUnit?: string; // Resolution unit for thumbnail
  };
  meta?:{
  hasExif: boolean; // Indicates whether EXIF data is available
  message?: string; // Message to describe issues or status (optional)
  }
};




