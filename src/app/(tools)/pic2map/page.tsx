import MapContainer from "../../components/image2map/MapContainer";
import { generatePageMetadata } from "../../../lib/MetadataGenerator";
import { Metadata } from "next";
const jsonLdSoftwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BasicUtils Pic2Map Tool",
    "operatingSystem": "Web-based",
    "applicationCategory": "UtilitiesApplication",
    "url": "https://basicutils.com/pic2map",
    "description": "Explore our online app that extracts EXIF metadata from your photos and displays where they were captured on an interactive map",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "3"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "authorJobTitle": "Travel Blogger",
        "datePublished": "2024-11-30",
        "reviewBody": "I use it for pleasure, trying to pinpoint exactly where my old images were taken.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Terry D."
        },
        "authorJobTitle": "Professional Photographer",
        "datePublished": "2024-11-30",
        "reviewBody": "The tool is a must-have for any photographer.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Simon M."
        },
        "authorJobTitle": "Cybersecurity Analyst",
        "datePublished": "2024-11-30",
        "reviewBody": "I have used BasicUtils Pic2Map tool several times to extract information from malicious photos.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4",
          "bestRating": "5"
        }
      }
    ]
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "BasicUtils Pic2Map Tool",
    "url": "https://basicutils.com/pic2map",
    "description": "Explore our online app that extracts EXIF metadata from your photos and displays where they were captured on an interactive map",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://basicutils.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Pic2Map Tool",
          "item": "https://basicutils.com/pic2map"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Image Compressor",
          "item": "https://basicutils.com/imagecompressor"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Image Resizer",
          "item": "https://basicutils.com/imageresizer"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Image Cropper",
          "item": "https://basicutils.com/imagecropper"
        }
      ]
    }
  };
  

  export async function generateMetadata(): Promise<Metadata> {
    // Static metadata values
    const staticMetadata = {
      title: "Pic2Map Online Tool",
      description: "Find out where a photo was taken! Our tool reads hidden GPS data in images to find the location on a map. Use Pic2Map to Extract and analyze EXIF metadata, view GPS coordinates, and explore camera settings.",
      keywords: "pic2map, EXIF metadata, EXIF data extraction, GPS coordinates from photos, online photo metadata viewer, photography tool, map photo locations, photo metadata analysis, travel photo map, photo GPS data, camera settings viewer, image metadata tool, photography data analysis, photo geotagging, EXIF data viewer, photo location app, digital photography tools, interactive photo map, Pic2Map app, Pic2Map tool, EXIF data app, travel photo app, photo map viewer, photo metadata tool, photo data extraction",
      canonicalUrl: `https://basicutils.com/pic2map`,
    };
  
    return generatePageMetadata(staticMetadata);
  }
  

const Page: React.FC = () => {
  

    return (<>

{jsonLdWebPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
        />
      )}
      {jsonLdSoftwareApplication && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApplication) }}
        />
      )}
    

        <MapContainer />

        </>
    );
  };
  
  export default Page;