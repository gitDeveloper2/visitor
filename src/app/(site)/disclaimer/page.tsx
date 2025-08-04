import { generatePageMetadata } from "../../../lib/MetadataGenerator";
import Disclaimer from '@components/support_pages/disclaimer';
const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Disclaimer",
  "url": "https://basicutils.com/contactus",
  "description": "Understand the limitations of liability and the scope of information provided on Basicutils.com. Our Disclaimer outlines the boundaries of our responsibility.",
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
    title: "Disclaimer",
    description: "Understand the limitations of liability and the scope of information provided on Basicutils.com. Our Disclaimer outlines the boundaries of our responsibility.",
    keywords: "disclaimer, limitations of liability, content reliability, external links, professional advice, educational purposes, online tools, Basicutils policies",
    canonicalUrl: "/disclaimer"
  });
}

const Page: React.FC = () => {
  return (<><script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
  />
  
  <Disclaimer/>
  </>
    
  );
}

export default Page;