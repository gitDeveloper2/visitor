import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "Getting Started with Quantum Computing: Building Your First Quantum Algorithm with IBM Qiskit and Google Cirq",
    description: "Discover the world of quantum computing with IBM Qiskit and Google Cirq. Learn how to build quantum algorithms, understand error correction, explore cutting-edge hardware like superconducting qubits and topological qubits, and dive into future innovations such as quantum machine learning and networks.",
    keywords: "Quantum Computing, IBM Qiskit, Google Cirq, Quantum Algorithm, Quantum AI, IBM Quantum Computer Announcement, Quantum Calculation, IBM Quantum Computer, Qubit, Quantum Error Correction, Quantum Hardware, Superconducting Qubits, Trapped Ions, Topological Qubits, Shor’s Algorithm, Grover’s Algorithm, Quantum Fourier Transform, Quantum Supremacy, Quantum Networks, Quantum Machine Learning",
    canonicalUrl: "/blog/building_your_first_quantum_algorithm_with_ibm_qiskit_and_google_cirq"
  });
}



export default function Test() {
  

  return (
   <PrismaSelfRelations/>
  );
}
