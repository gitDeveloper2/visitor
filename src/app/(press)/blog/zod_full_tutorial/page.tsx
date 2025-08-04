import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "How to Learn Zod: Complete Guide to Zod Schema, Validation, Transformations, and More",
    description: "Discover how to use Zod effectively with this comprehensive guide. Learn about Zod schema, validation methods, transformations, and practical examples. Compare Zod with other libraries and understand why it might be the best choice for your TypeScript projects.",
    keywords: "how to learn zod, how does zod work, what is faster than zod, why use zod instead of typescript, zod examples, zod schema, zod transform, zod validation, zod required, zod regex example, zod enum example, zod form example, zod transform example, zod refine example, zod preprocess example",
    canonicalUrl: "/blog/zod_full_tutorial"
  });
}


export default function Test() {
  

  return (
   <PrismaSelfRelations/>
  );
}
