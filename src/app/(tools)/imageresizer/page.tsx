import ImageResizer from "@components/libs/ImageResizer";
import { generatePageMetadata } from "../../../lib/MetadataGenerator";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Image Resizer",
    description: "Resize images online with our user-friendly image resizer. Adjust dimensions and reduce image size for optimal web performance and social media sharing.",
    keywords: "image resizer, resize images, image resizing tool, online image resizer, photo resizer, online photo resize, resize jpg, resize png, image size reducer, picture resizer, free image resizer, resize photos online, change image dimensions, online image editor, resize images for web, photo resizing tool, resize pictures, image dimension changer, online image resize tool",
    canonicalUrl:"/imageresizer"
  });
}

const Page: React.FC = () => {
  return (
    <>
      <ImageResizer />
    </>
  );
};

export default Page;
