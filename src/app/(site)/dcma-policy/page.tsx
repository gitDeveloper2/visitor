import { generatePageMetadata } from "../../../lib/MetadataGenerator";
import DCMA from "@components/support_pages/DCMA";
const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "DCMA Policy",
  "url": "https://basicutils.com/contactus",
  "description": "Review our DMCA Policy to understand the procedures for copyright infringement claims and takedown requests on Basicutils.com",
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
    title: "DMCA Policy",
    description: "Review our DMCA Policy to understand the procedures for copyright infringement claims and takedown requests on Basicutils.com.",
    keywords: "DMCA policy, copyright infringement, takedown requests, intellectual property, Basicutils compliance, copyright protection, DMCA procedures",
    canonicalUrl: "/dcma"
  });
}

const Page: React.FC = () => {
  return (
    <><script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
  />
  <DCMA/>
  </>
    
  );
}

export default Page;