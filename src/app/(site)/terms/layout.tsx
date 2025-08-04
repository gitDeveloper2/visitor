import { generatePageMetadata } from "@lib/MetadataGenerator";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Use - BasicUtils",
  description: "Terms of Use for BasicUtils. Please read these terms carefully before using our platform designed to simplify and inspire technology.",
  keywords: "terms of use, legal, basicutils, developer tools, terms and conditions",
  canonicalUrl: "/terms",
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 