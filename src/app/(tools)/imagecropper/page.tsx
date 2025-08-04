import ImageCropper from "@components/libs/ImageCropper";
import { generatePageMetadata } from "../../../lib/MetadataGenerator";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Image Crop",
    description: "Crop images quickly and easily with our online image cropper. Customize your photos by trimming unwanted areas to highlight what matters most.",
    keywords: "image cropper, crop images, image cropping tool, online image cropper, crop photos, photo cropper, online photo crop, crop jpg, crop png, image resizer, picture cropper, free image cropper, crop photos online, crop images for free, resize and crop images, photo editor, online photo editor, image trimming tool, crop pictures",
    canonicalUrl:"/imagecropper"
  });
}

 function ImageCrop() {
  return (
    <>
      <ImageCropper />
    </>
  );
}

export default ImageCrop;
