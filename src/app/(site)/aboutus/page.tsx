import React from 'react';
import AboutUs from '@components/support_pages/AboutUsComponent';
import { generatePageMetadata } from "../../../lib/MetadataGenerator";
const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "About Us",
  "url": "https://basicutils.com/contactus",
  "description": "Learn more about our mission and values. Discover how our online image tools can help you compress, crop, and resize images effortlessly.",
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
    title: "About Us Page",
    description: "Learn more about our mission and values. Discover how our online image tools can help you compress, crop, and resize images effortlessly.",
    keywords: "image tools, image compressor, image cropper, image resizer, online image tools, compress images, crop images, resize images, photo editor, online photo tools, image optimization, image editing, reduce image size, crop photos, resize photos, free image tools, compress jpg, crop jpg, resize jpg, compress png, crop png, resize png, online image editor, image processing, optimize images for web",
    canonicalUrl:"/aboutus"
  });
}
const Page: React.FC = () => {
  return (
    <><script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
  />
   <AboutUs/>
   </>
    
  );
}

export default Page;
