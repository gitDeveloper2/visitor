import ImageCompressor from "@components/libs/ImiageCompressor";
import { generatePageMetadata } from "../../../lib/MetadataGenerator";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Compress Image to Email Size",
    description: "Discover how to compress images for email and website use with our comprehensive guide. Learn methods to compress image to email size, optimize images for web performance, and use various formats like WebP. Find tips on achieving quality compression without losing image clarity.",
    keywords: "compress image to email size, how to compress image for email, compress image for your website, compress image webp, compress image to 20kb, compress image to 100kb, compress image to 195kb, compress image to 200kb, compress image without losing quality online free, compress image quality online size, compress image no quality loss, compress image now, compress image app, online image compressor, free image compression tool, reduce image file size, image optimization for websites, email image compression, high-quality image compression",
    canonicalUrl: "/imagecompressor" // Update with the full URL if available
  });
}

const Page: React.FC = () => {
  return (
    <>
      <ImageCompressor />
    </>
  );
};
export default Page;
