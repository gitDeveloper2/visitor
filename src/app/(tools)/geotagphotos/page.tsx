import { generatePageMetadata } from "../../../lib/MetadataGenerator";
import { Metadata } from "next";
import { GeotagLayout } from "@components/image2map/TaggerLayout";
const jsonLdSoftwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free Geotag Photos Online",
  operatingSystem: "Web-based",
  applicationCategory: "UtilitiesApplication",
  url: "https://basicutils.com/geotagphotos",
  description:
    "A free web-based tool that allows users to add, edit, or extract GPS coordinates from photos effortlessly. No downloads required—just upload your image, adjust metadata, and download instantly.",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "5",
  },
  review: [
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Emily W.",
      },
      authorJobTitle: "Adventure Photographer",
      datePublished: "2024-11-30",
      reviewBody:
        "This tool is perfect for tracking the locations of my photos while traveling the world. Easy to use and fast!",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Daniel S.",
      },
      authorJobTitle: "Creative Director",
      datePublished: "2024-11-30",
      reviewBody:
        "I use this tool for my marketing campaigns, and it helps me organize location-specific images with ease. Highly recommend!",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Mia L.",
      },
      authorJobTitle: "Travel Blogger",
      datePublished: "2024-11-30",
      reviewBody:
        "It’s amazing how much this tool simplifies my photo management. I can now easily display where my pictures were taken!",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4",
        bestRating: "5",
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Oliver K.",
      },
      authorJobTitle: "Documentary Filmmaker",
      datePublished: "2024-11-30",
      reviewBody:
        "This tool has made a huge difference in managing metadata for my project. It’s quick and efficient.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Sophia R.",
      },
      authorJobTitle: "Professional Videographer",
      datePublished: "2024-11-30",
      reviewBody:
        "Free Geotag Photos Online helped me improve my workflow by accurately tagging all my video files with the right coordinates.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
  ],
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Free Geotag Photos Online Tool",
  url: "https://basicutils.com/geotagphotos",
  description:
    "A free web-based tool that allows users to add, edit, or extract GPS coordinates from photos effortlessly. No downloads required—just upload your image, adjust metadata, and download instantly.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://basicutils.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Free Geotag Photos Online",
        item: "https://basicutils.com/geotagphotos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Image Compressor",
        item: "https://basicutils.com/imagecompressor",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Image Resizer",
        item: "https://basicutils.com/imageresizer",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Image Cropper",
        item: "https://basicutils.com/imagecropper",
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  // Static metadata values
  const staticMetadata = {
    title: "Free Geotag Photos Online – Add GPS Data to Images Instantly",
    description:
      "A free web-based tool that allows users to add, edit, or extract GPS coordinates from photos effortlessly. No downloads required—just upload your image, adjust metadata, and download instantly.",
    keywords:
      "geotag photos, add GPS to images, online geotagging tool, photo metadata editor, GPS photo tagging, EXIF data tool, map photo locations, image geolocation tool, free photo GPS tagging, add location to photos, edit EXIF metadata, online EXIF editor, geotag images, GPS EXIF editor, GPS metadata tool, batch geotagging, GPS camera data, geolocation photo tool, online metadata viewer, photo coordinate finder, image location tracker, GPS info in photos, photo EXIF reader",
    canonicalUrl: `https://basicutils.com/geotagphotos`,
  };

  return generatePageMetadata(staticMetadata);
}

const Page: React.FC = () => {
  return (
    <>
      {jsonLdWebPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
        />
      )}
      {jsonLdSoftwareApplication && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftwareApplication),
          }}
        />
      )}

      <GeotagLayout />
    </>
  );
};

export default Page;
