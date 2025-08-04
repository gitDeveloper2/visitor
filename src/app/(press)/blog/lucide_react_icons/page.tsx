import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "The Ultimate Guide to Lucide React Icons: Enhance Your Web Development",
    description: "Discover how to use Lucide React Icons to enhance your React projects. This guide covers installation, customization, and the benefits of using Lucide React Icons over other libraries.",
    keywords: "Lucide React Icons, Lucide React npm, Lucide Icons Filled, Lucide Icons, Lucide Icons React, React icon libraries, icon customization, modern icons for React",
    canonicalUrl: "/blog/lucide_react_icons"
  });
}



export default function Test() {
  

  return (
   <PrismaSelfRelations/>
  );
}
