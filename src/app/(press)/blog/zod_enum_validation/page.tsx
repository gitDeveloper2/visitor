import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import { buildWebsiteJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, getAbsoluteUrl } from "../../../../lib/JsonLd";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "Mastering Zod Enum Validation: A Comprehensive Guide",
    description: "Learn everything you need to know about Zod enum validation, including how to define and use enums, compare Zod enums with native enums, handle enum error messages, and more. Explore practical examples and best practices for integrating Zod enums in your TypeScript applications.",
    keywords: "Zod enum validation, Zod enum array, Zod enum error message, Zod enum from object keys, Zod enum numbers, Zod enum vs native enum, Zod enum vs union, Zod enum optional, Zod enum examples",
    canonicalUrl: "/blog/zod_enum_validation",
    type: "article",
  });
}



export default function Test() {
  

  return (
   <>
     <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteJsonLd()) }} />
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{
         __html: JSON.stringify(
           buildBreadcrumbJsonLd([
             { name: "Home", url: getAbsoluteUrl("/") },
             { name: "Blog", url: getAbsoluteUrl("/blog") },
             { name: "Zod Enum Validation", url: getAbsoluteUrl("/blog/zod_enum_validation") },
           ])
         ),
       }}
     />
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{
         __html: JSON.stringify(
           buildArticleJsonLd({
             title: "Mastering Zod Enum Validation: A Comprehensive Guide",
             description:
               "Learn everything you need to know about Zod enum validation, including how to define and use enums, compare Zod enums with native enums, handle enum error messages, and more. Explore practical examples and best practices for integrating Zod enums in your TypeScript applications.",
             canonicalUrl: getAbsoluteUrl("/blog/zod_enum_validation"),
           })
         ),
       }}
     />
     <PrismaSelfRelations/>
   </>
  );
}
