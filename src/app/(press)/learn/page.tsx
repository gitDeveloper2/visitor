import { connectToDatabase } from "../../../lib/mongodb";
import { Metadata } from "next";
import { generatePageMetadata } from "../../../lib/MetadataGenerator";
import LearnIndexClient from "./LearnIndexClient";

export const dynamic = "force-static";
export const revalidate = 345600;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Learn Development, Programming & Tech Skills – BasicUtils",
    description: "Master programming, development, and tech skills with our comprehensive learning resources. From beginner tutorials to advanced concepts in JavaScript, TypeScript, React, Next.js, and more.",
    keywords: "programming tutorials, development guides, JavaScript tutorials, TypeScript, React, Next.js, web development, coding skills, tech learning, programming courses, software development, frontend development, backend development, DevOps, cloud computing, BasicUtils",
    canonicalUrl: "/learn",
  });
}

// Define JSON-LD for the learn section
const learnJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Learning Resources",
  "description": "Comprehensive learning resources for developers and tech enthusiasts",
  "url": "https://basicutils.com/learn",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Learning Resources Collection"
  }
};

export default async function LearnPage() {
  const { db } = await connectToDatabase();
  
  // Fetch all published pages for learning content
  const pages = await db
    .collection("pages")
    .find({ isPublished: true })
    .sort({ created_at: -1 })
    .toArray();

  // Fetch authors for the pages
  const authorIds = [...new Set(pages.map(page => page.authorId).filter(Boolean))];
  const authors = await db
    .collection("authors")
    .find({ authorId: { $in: authorIds } })
    .toArray();

  // Create a map of authors for quick lookup
  const authorMap = authors.reduce((acc, author) => {
    acc[author.authorId] = author;
    return acc;
  }, {} as Record<string, any>);

  // Enhance pages with author information
  const enhancedPages = pages.map(page => ({
    ...page,
    author: authorMap[page.authorId] || { name: "Unknown Author", bio: "", profilePicture: null }
  }));

  // Extract unique domains for filtering
  const domains = [...new Set(pages.map(page => page.domain).filter(Boolean))];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learnJsonLd) }}
      />
      
      <LearnIndexClient 
        initialPages={enhancedPages}
        domains={domains}
      />
    </>
  );
} 