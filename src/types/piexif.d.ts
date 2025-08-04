declare module "piexifjs" {
    export const ImageIFD: {
        Make: string;
        Model: string;
        Orientation: string;
        XResolution: string;
        YResolution: string;
        ResolutionUnit: string;
        Software: string;
        DateTime: string;
        Artist: string;
        Copyright: string;
        Compression: string; // Compression method used

    };

    export const ExifIFD: {
        ExposureTime: string;
        FNumber: string;
        ISOSpeedRatings: string;
        DateTimeOriginal: string;
        DateTimeDigitized: string;
        ShutterSpeedValue: string;
        ApertureValue: string;
        BrightnessValue: string;
        ExposureBiasValue: string;
        MaxApertureValue: string;
        SubjectDistance: string;
        FocalLength: string;
        FocalLengthIn35mmFilm: string;
        UserComment: string;
        SubSecTime: string;
        SubSecTimeOriginal: string;
        SubSecTimeDigitized: string;
        ColorSpace: string;
        PixelXDimension: string;
        PixelYDimension: string;
        Flash: string; // Flash information (e.g., whether the flash fired)
        MeteringMode: string; // Metering mode (e.g., average, spot, center-weighted)
        WhiteBalance:string
    
    };

    export const GPSIFD: {
        GPSLatitudeRef: string;
        GPSLatitude: string;
        GPSLongitudeRef: string;
        GPSLongitude: string;
        GPSAltitudeRef: string;
        GPSAltitude: string;
        GPSTimeStamp: string;
        GPSImgDirection: string;
        GPSDateStamp: string;
        GPSSpeed?: string;       // Optional: Speed in km/h or mph
        GPSSpeedRef?: string;    // Optional: Speed unit (K for km/h, M for mph)
        GPSProcessingMethod?: string; // Optional: GPS processing method
    };

    export function load(imageStr: string): {
        "0th": Record<string, any>;
        Exif: Record<string, any>;
        GPS: Record<string, any>;
        "1st": Record<string, any>;
        thumbnail: string | null;
    };

    export function dump(data: any): string;
    export function insert(exifStr: string, imageStr: string): string;
}
