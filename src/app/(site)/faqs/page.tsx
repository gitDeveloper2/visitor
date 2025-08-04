import FAQS from "@components/support_pages/FAQS";
import { generatePageMetadata } from "../../../lib/MetadataGenerator";
const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "FAQS",
  "url": "https://basicutils.com/contactus",
  "description": "Find answers to the most commonly asked questions about BasicUtils tools, including image compression, resizing, cropping, and more. Get help and support quickly and easily.",
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
        "name": "Contact Us",
        "item": "https://basicutils.com/contactus"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "About Us",
        "item": "https://basicutils.com/aboutus"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Privacy Policy",
        "item": "https://basicutils.com/policy"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Terms of Use",
        "item": "https://basicutils.com/terms"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "FAQs",
        "item": "https://basicutils.com/faqs"
      },
      {
        "@type": "ListItem",
        "position": 7,
        "name": "Disclaimer",
        "item": "https://basicutils.com/disclaimer"
      },
      {
        "@type": "ListItem",
        "position": 8,
        "name": "DMCA Policy",
        "item": "https://basicutils.com/dcma-policy"
      }
    ]
  }
};
export async function generateMetadata() {
  return generatePageMetadata({
    title: "FAQs - Frequently Asked Questions",
    description: "Find answers to the most commonly asked questions about BasicUtils tools, including image compression, resizing, cropping, and more. Get help and support quickly and easily.",
    keywords: "FAQ, frequently asked questions, image tools, image compressor, image resizer, image cropper, online image tools, support, help, image editing, photo tools",
    canonicalUrl: "/faqs"
  });
}

const Page: React.FC = () => {
  return (
    <><script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
  /><FAQS/></>
    
  );
}

export default Page;