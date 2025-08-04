import piexif from "piexifjs";
import { base64ToBlob, uint8ToBase64 } from "../../../utils/transformers/base64Helpers";
// import { base64ToBlob, uint8ToBase64 } from "../utils/base64Helpers";

export async function processImage(file: File, exifObj: Record<string, any>) {
  try {
  
    // Read the file as an ArrayBuffer and convert it to base64
    const arrayBuffer = await file.arrayBuffer();
   
    const imageData = new Uint8Array(arrayBuffer);
  
    
    const base64String = uint8ToBase64(imageData);
    
    const test={
      "0th": {
        "271": "Teefs",  // Software used to create or edit the image
        "272": "Mkaidf", // Software used (second entry)
        "305": "Photoshop",  // Application used
        "306": "2025-01-01T01:01:01",  // Date and time of the image creation
        "34665": 129,  // Type of GPS information (field type)
        "34853": 163,   // Image orientation
        "33434": [1, 116],  // EXIF version
        "40091": 1,  // Shutter speed
        "40092": 200,  // ISO setting
        "40093": 3,  // Aperture
        "40094": 0.5  // White balance
      },
      "Exif": {
        "33434": [1, 116],  // EXIF version
        "37510": "Yud",  // Software version or custom tag
        "40962": [255, 1],  // Flash setting
        "40963": [0, 1],  // Flash status
        "40964": 45  // Exposure time
      },
      "GPS": {
        "0": [2, 3, 0, 0],  // GPS Version
        "1": "N",  // Latitude hemisphere (N = North)
        "2": [[30, 1], [18, 1], [0, 1000]],  // Latitude in DMS (30° 18' 0" N)
        "3": "E",  // Longitude hemisphere (E = East)
        "4": [[2, 1], [13, 1], [12000, 1000]],  // Longitude in DMS (2° 13' 12" E)
        "5": 0,  // GPSAltitudeRef (0 = above sea level)
        "6": [300, 1]  // GPSAltitude (300 meters)
      },
      "1st": {
        "120": "Camera",  // Camera model
        "121": "Brand",  // Camera brand
        "122": "Digital",  // Image type
        "123": "RAW",  // Image format
        "124": "Auto",  // Exposure mode
        "125": 5,  // Focal length
        "126": 12  // Lens model
      },
      "Interop": {},
      "thumbnail": null
    }
    
    
    const exifBytes = piexif.dump(exifObj);
    
    // Embed the updated EXIF data back into the image
    const updatedBase64 = piexif.insert(exifBytes, base64String);
    

    // Return the updated image as a Blob
    return base64ToBlob(updatedBase64, file.type);
  } catch (error) {
    // console.error("Error processing image:", error);

    // In case of error, return the original image as a Blob
    const originalBase64 = uint8ToBase64(new Uint8Array(await file.arrayBuffer()));
    return base64ToBlob(originalBase64, file.type);
  }
}




