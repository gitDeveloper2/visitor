import { generatePageMetadata } from "@lib/MetadataGenerator";
import { connectToDatabase } from "@lib/mongodb";
import { Box } from "@mui/material";
import { Metadata } from "next";
import Hero from "../../components/Hero";
import ToolsSection from "../../components/ToolsSection";
import Testimonials from "../../components/Testimonials";
import AboutUs from "../../components/AboutUs";
import BlogSection from "../../components/BlogSection";
import DonateButton from "../../components/DonateButton";
import Footer from "../../components/Footer";

export const dynamic="force-static"
export const revalidate = 345600;

export async function generateMetadata(): Promise<Metadata> {
   return generatePageMetadata({
   title: "Explore All Developer Guides, Coding Tutorials & Articles – BasicUtils",
   description: "Browse all articles, tutorials, and how-to guides published on Basicutils. Stay updated with the latest in web development, JavaScript, TypeScript, Next.js, and more.",
   keywords: "programming tutorials, DevOps guides, JavaScript tutorials, TypeScript, React, Next.js, Spring Boot, tool reviews, developer tools, software development, coding resources, frontend development, backend development, REST APIs, JWT authentication, CI/CD pipelines, cloud computing, image processing tools, BasicUtils",
   canonicalUrl: "/home",
 });
}

// Define JSON-LD for the website
const websiteJsonLd = {
   "@context": "https://schema.org",
   "@type": "WebSite",
   url: "https://basicutils.com", // Replace with your website's URL
   name: "basicutils.com",
   potentialAction: {
     "@type": "SearchAction",
     target: "https://basicutils.com/search?q={search_term_string}", // Replace with your search URL
     "query-input": "required name=search_term_string",
   },
 };

export default async function Page() {
  const { db } = await connectToDatabase();
  const data = await db
    .collection("pages")
    .find({}, { projection: { canonical_url: 1, title: 1, meta_description: 1, keywords: 1 } })
    .toArray();

  return (
    <>
      {websiteJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      )}
      
      <Box sx={{ 
        minHeight: "100vh", 
        bgcolor: "background.default",
        overflow: "hidden" // Prevent horizontal scroll
      }}>
        <DonateButton />
        <Box component="main">
          <Hero />
          <ToolsSection />
          <Testimonials />
          <AboutUs />
          <BlogSection />
        </Box>  
      </Box>
    </>
  );
}
