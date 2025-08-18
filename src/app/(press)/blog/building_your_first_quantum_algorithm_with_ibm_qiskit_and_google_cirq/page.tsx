import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import { buildWebsiteJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, getAbsoluteUrl } from "../../../../lib/JsonLd";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "Getting Started with Quantum Computing: Building Your First Quantum Algorithm with IBM Qiskit and Google Cirq",
    description: "Discover the world of quantum computing with IBM Qiskit and Google Cirq. Learn how to build quantum algorithms, understand error correction, explore cutting-edge hardware like superconducting qubits and topological qubits, and dive into future innovations such as quantum machine learning and networks.",
    keywords: "Quantum Computing, IBM Qiskit, Google Cirq, Quantum Algorithm, Quantum AI, IBM Quantum Computer Announcement, Quantum Calculation, IBM Quantum Computer, Qubit, Quantum Error Correction, Quantum Hardware, Superconducting Qubits, Trapped Ions, Topological Qubits, Shor’s Algorithm, Grover’s Algorithm, Quantum Fourier Transform, Quantum Supremacy, Quantum Networks, Quantum Machine Learning",
    canonicalUrl: "/blog/building_your_first_quantum_algorithm_with_ibm_qiskit_and_google_cirq",
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
             { name: "Quantum: Build Your First Algorithm", url: getAbsoluteUrl("/blog/building_your_first_quantum_algorithm_with_ibm_qiskit_and_google_cirq") },
           ])
         ),
       }}
     />
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{
         __html: JSON.stringify(
           buildArticleJsonLd({
             title: "Getting Started with Quantum Computing: Building Your First Quantum Algorithm with IBM Qiskit and Google Cirq",
             description:
               "Discover the world of quantum computing with IBM Qiskit and Google Cirq. Learn how to build quantum algorithms, understand error correction, explore cutting-edge hardware like superconducting qubits and topological qubits, and dive into future innovations such as quantum machine learning and networks.",
             canonicalUrl: getAbsoluteUrl("/blog/building_your_first_quantum_algorithm_with_ibm_qiskit_and_google_cirq"),
           })
         ),
       }}
     />
     <PrismaSelfRelations/>
   </>
  );
}
