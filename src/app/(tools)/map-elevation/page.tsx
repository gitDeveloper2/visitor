import { generatePageMetadata } from "../../../lib/MetadataGenerator";
import { Metadata } from "next";
import { ElevationPage } from "./Elevation";

const jsonLdSoftwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Elevation Map Finder – Interactive Elevation Map Tool",
  operatingSystem: "Web-based",
  applicationCategory: "UtilitiesApplication",
  url: "https://basicutils.com/elevationfinder",
  description:
    "A fast, interactive elevation map tool that provides instant terrain elevation data. Click the map, enter coordinates, or paste GPS strings to get altitude insights with location context.",
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
      author: { "@type": "Person", name: "Elena M." },
      authorJobTitle: "Cartographer",
      datePublished: "2024-11-30",
      reviewBody:
        "An intuitive tool that helps me verify elevation data quickly. Great for both casual use and serious mapping work.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Jason T." },
      authorJobTitle: "Hiking Guide",
      datePublished: "2024-11-30",
      reviewBody:
        "I plan all my hikes with this. It shows elevation clearly and helps me prepare my routes better than traditional maps.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Liam K." },
      authorJobTitle: "Outdoor Educator",
      datePublished: "2024-11-30",
      reviewBody:
        "Very helpful in teaching students about topography. Easy to use and visually appealing.",
      reviewRating: { "@type": "Rating", ratingValue: "4", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Natalie B." },
      authorJobTitle: "Landscape Architect",
      datePublished: "2024-11-30",
      reviewBody:
        "I use this tool to quickly survey elevation for site feasibility. Clean UI and surprisingly accurate.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Zach F." },
      authorJobTitle: "Geography Student",
      datePublished: "2024-11-30",
      reviewBody:
        "I love how simple and powerful it is. It helps me quickly understand terrain without needing to load heavy GIS software.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
  ],
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Elevation Map Finder – Free Elevation Map Tool Online",
  url: "https://basicutils.com/elevationfinder",
  description:
    "Use the Elevation Map Finder to get real-time elevation data from a world map. Click on the map or enter coordinates to see terrain height instantly, with extra geographic context.",
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
        name: "Elevation Map Finder",
        item: "https://basicutils.com/elevationfinder",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Geotag Photos",
        item: "https://basicutils.com/geotagphotos",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Image Compressor",
        item: "https://basicutils.com/imagecompressor",
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const staticMetadata = {
    title: "Elevation Map Finder – Free Elevation Map Tool Online",
    description:
      "Explore elevation data from around the world using the Elevation Map Finder. Click the map or enter coordinates to get height and area info instantly.",
    keywords:
      "elevation map, elevation finder, elevation map finder, online elevation tool, get altitude by coordinates, terrain map, free elevation lookup, map height tool, topography tool, GPS elevation data, reverse geocode elevation, interactive terrain map, digital elevation model, DEM lookup, location elevation, online altimeter",
    canonicalUrl: "https://basicutils.com/elevationfinder",
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

      <ElevationPage/>
    </>
  );
};

export default Page;
