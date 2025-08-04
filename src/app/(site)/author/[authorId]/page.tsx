// pages/authors/[authorId].tsx

import { notFound } from "next/navigation";
import { connectToDatabase } from "../../../../lib/mongodb";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import { selectiveLogger } from "../../../../utils/logger/customLogger";

import { Box } from "@mui/material";
import AuthorPosts, { Post } from "./AuthorPosts";
import AuthorProfile from "./AuthorProfile";
import ConnectWithAuthor from "./ConnectWithAuthor";

export const revalidate = 86400;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { authorId: string };
}) {
  const { db } = await connectToDatabase();
  const author = await db.collection("authors").findOne({ authorId: params.authorId });

  if (!author) {
    notFound();
  }

  return generatePageMetadata({
    title: author.name,
    description: author.bio,
    keywords: author.name,
    canonicalUrl: `/authors/${params.authorId}`,
  });
}

// Generate static params for dynamic routes
export async function generateStaticParams() {
  const { db } = await connectToDatabase();
  const authors = await db.collection("authors").find().toArray();

  return authors.map((author) => ({
    authorId: author.authorId,
  }));
}

export default async function AuthorPage({
  params,
}: {
  params: { authorId: string };
}) {
  const { db } = await connectToDatabase();

  // Get author details
  const author = await db.collection("authors").findOne({ authorId: params.authorId });
  if (!author) {
    notFound();
  }

  // Get posts (pages) by the author
  const posts = await db.collection("pages").find({ authorId: params.authorId }).toArray();

  // Cast posts to the correct Post[] type
  const typedPosts: Post[] = posts.map((post) => ({
    slug: post.canonical_url,
    title: post.title,
    content: post.meta_description,
    image: post.image_url,

  }));
const socialLinks=author.socialLinks

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: author.name,
  description: author.bio,
  url: `https://basicutils.com/authors/${author.authorId}`,
  mainEntity: {
    "@type": "Person",
    name: author.name,
    image: author.profilePicture,
    description: author.bio,
    url: `https://basicutils.com/authors/${author.authorId}`,
    ...(author.jobTitle && { jobTitle: author.jobTitle }),
    ...(author.organization?.name && { 
      worksFor: { 
        "@type": "Organization", 
        name: author.organization.name,
        ...(author.organization.url && { url: author.organization.url }),
      }
    }),
    ...(author.socialLinks && Object.values(author.socialLinks).length > 0 && { 
      sameAs: Object.values(author.socialLinks).filter(link => link)
    }), // Filters out undefined/null links
    ...(author.expertise?.length && { knowsAbout: author.expertise }), // Expertise topics
    ...(author.education?.university && { 
      alumniOf: { 
        "@type": "EducationalOrganization", 
        name: author.education.university,
        ...(author.education.degree && { degree: author.education.degree }),
        ...(author.education.graduationYear && { graduationYear: author.education.graduationYear }),
      }
    }),
    ...(author.birthDate && { birthDate: author.birthDate }),
    ...(author.nationality && { nationality: author.nationality }),
    ...(author.contact?.website && { url: author.contact.website }),
  },
};





  const articlesJsonLd = posts?.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": posts.map((post, index) => ({
          "@type": "Article",
          position: index + 1,
          author: {
            "@type": "Person",
            name: author.name,
            url: `https://basicutils.com/authors/${author.authorId}` // Author's URL
          },
          headline: post.title,
          url: `https://basicutils.com/${post.slug}`,
          datePublished: post.datePublished || new Date().toISOString(),
          image: post.image || "https://basicutils.com/default-article-image.png"
        }))
      }
    : null;  
    selectiveLogger.info("/author loaded successfully");

  return (
    <>
     {profilePageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
        />
       )} 
       {articlesJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(articlesJsonLd)
            }}
          />
        )}
    <Box sx={{ padding: 3 }}>
      
      {/* Author Profile */}
      <AuthorProfile name={author.name} profilePicture={author.profilePicture} bio={author.bio} />

      {/* Author Posts */}
      <AuthorPosts posts={typedPosts} authorName={author.name} />
      <ConnectWithAuthor
        name={author.name}
        twitterUrl={socialLinks.twitter}
        facebookUrl={socialLinks.facebook}
        linkedinUrl={socialLinks.linkedin}
        email={socialLinks.email}
      />
    </Box>
    </>
    
  );
}
