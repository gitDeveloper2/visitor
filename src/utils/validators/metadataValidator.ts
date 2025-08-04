


// // export function validateFormData(formData: FormData) {
// //   const imageFile = formData.get("image") as File | null;
// //   const rawMetadata = formData.get("metadata");
// //   if (!imageFile || !imageFile.type.startsWith("image/jpeg")) {
// //     throw { status: 400, message: "Only JPEG images are supported." };
// //   }

// //   let metadata = {};

// //   if (rawMetadata && typeof rawMetadata === "string") {
// //     try {
// //       metadata = metadataSchema.parse(JSON.parse(rawMetadata));
// //     } catch (error) {
// //       throw { status: 400, message: "Invalid metadata format." };
// //     }
// //   } else if (rawMetadata && rawMetadata instanceof File) {
// //     // Handle the File case, for example, skipping or throwing an error
// //     throw { status: 400, message: "Metadata should be a JSON string, not a file." };
// //   }
// //   return { imageFile, metadata };
// // }


// export function validateFormData(imageFile: File | null, rawMetadata: string | object) {
//   // Check if imageFile exists and is a JPEG
//   if (!imageFile || !imageFile.type.startsWith("image/jpeg")) {
//     throw { status: 400, message: "Only JPEG images are supported." };
//   }

//   let metadata = {};

//   // If rawMetadata is a string, try to parse it as JSON
//   if (typeof rawMetadata === "string") {
//     try {
//       metadata = metadataSchema.parse(JSON.parse(rawMetadata));
//     } catch (error) {
//       throw { status: 400, message: "Invalid metadata format." };
//     }
//   } else if (rawMetadata && typeof rawMetadata === "object") {
//     // If rawMetadata is already an object, directly assign it
//     metadata = metadataSchema.parse(rawMetadata);
//   } else {
//     // If rawMetadata is invalid (not a string or object), throw an error
//     throw { status: 400, message: "Metadata should be a valid JSON string or object." };
//   }

//   // Return the validated image file and metadata
//   return { imageFile, metadata };
// }

