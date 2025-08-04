import React from 'react';
import { generatePageMetadata } from "../../../lib/MetadataGenerator";
import ContactUs from '@components/support_pages/ContactUs';

const jsonLdContactPage = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "url": "https://basicutils.com/contactus",
  "name": "Contact Us",
  "description": "Get in touch with us for any questions or support regarding our image tools.",
  "mainEntity": {
    "@type": "Organization",
    "name": "BasicUtils",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@basicutils.com",
      // "areaServed": "World", // Updated to "World"
      "availableLanguage": "English"
    }
  }
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Contact Us",
  "url": "https://basicutils.com/contactus",
  "description": "Get in touch with us for any questions or support",
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
  const staticMetadata = {
    title: "Contact Us",
    description: "Get in touch with us for any questions or support regarding our image tools. We're here to help you with image compression, cropping, and resizing.",
    canonicalUrl: "/contactus",
    keywords: "image tools, image compressor, image cropper, image resizer, online image tools, compress images, crop images, resize images"
  };

  return generatePageMetadata(staticMetadata);
}

const Page: React.FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContactPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <ContactUs />
    </>
  );
};

export default Page;
