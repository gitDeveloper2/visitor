import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import { buildWebsiteJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, getAbsoluteUrl } from "../../../../lib/JsonLd";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "The Ultimate Guide to Lucide React Icons: Enhance Your Web Development",
    description: "Discover how to use Lucide React Icons to enhance your React projects. This guide covers installation, customization, and the benefits of using Lucide React Icons over other libraries.",
    keywords: "Lucide React Icons, Lucide React npm, Lucide Icons Filled, Lucide Icons, Lucide Icons React, React icon libraries, icon customization, modern icons for React",
    canonicalUrl: "/blog/lucide_react_icons",
    type: "article",
  });
}



export default function Test() {
  

  return (
   <>
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteJsonLd()) }}
     />
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{
         __html: JSON.stringify(
           buildBreadcrumbJsonLd([
             { name: "Home", url: getAbsoluteUrl("/") },
             { name: "Blog", url: getAbsoluteUrl("/blog") },
             { name: "Lucide React Icons", url: getAbsoluteUrl("/blog/lucide_react_icons") },
           ])
         ),
       }}
     />
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{
         __html: JSON.stringify(
           buildArticleJsonLd({
             title: "The Ultimate Guide to Lucide React Icons: Enhance Your Web Development",
             description:
               "Discover how to use Lucide React Icons to enhance your React projects. This guide covers installation, customization, and the benefits of using Lucide React Icons over other libraries.",
             canonicalUrl: getAbsoluteUrl("/blog/lucide_react_icons"),
           })
         ),
       }}
     />
     <PrismaSelfRelations/>
   </>
  );
}
