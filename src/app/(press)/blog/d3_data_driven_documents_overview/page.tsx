import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "Key Concepts of D3.js. (A d3 data driven documents overview)",
    description: "Learn about D3.js with a focus on D3.js data visualization and D3.js examples. Explore D3.js in React, its applications, and see how it compares to Chart.js and Sigma.js. Discover if D3.js is obsolete, its prerequisites, and how it is used by companies. Get insights into the D3.js GitHub repository and why you might choose or avoid D3.js for your projects.",
    keywords: "D3.js, D3.js data visualization, D3.js examples, D3.js in React, D3.js GitHub, D3.js applications, Is D3.js obsolete, D3.js vs Chart.js, D3.js vs Sigma.js, D3.js prerequisites, companies using D3.js",
    canonicalUrl: "/blog/d3_data_driven_documents_overview"
  });
}



export default function Test() {
  

  return (
   <PrismaSelfRelations/>
  );
}
