import { connectToDatabase } from "../../../../../lib/mongodb";
// import PrismaSelfRelations from "./content";
import { Metadata } from "next";
import { notFound } from "next/navigation"; // To handle not found cases
import { generatePageMetadata } from "../../../../../lib/MetadataGenerator";
import BlogComponentContainer, {
  RelatedPagesDocument,
} from "@components/blog/BloogComponentContainer";
import { AuthorProfile } from "../../../../../types/Author";
import { BibliographyState } from "../../../../../hooks/useBibliography";
import { FAQ } from "@components/libs/faqReducer";

export const revalidate = 345600;

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}): Promise<Metadata> {
  const { db } = await connectToDatabase();
  const page = await db
    .collection("news")
    .findOne({ domain: params.domain, slug: params.slug });

  if (!page) {
    notFound();
  }
  
  if (!page.isPublished) {
    notFound();
  }


  return generatePageMetadata({
    title: page.title,
    description: page.meta_description,
    keywords: page.keywords,
    canonicalUrl: page.canonical_url,
    ...(page.updated_at && { updatedAt: page.updated_at }), // Only pass updatedAt if it exists

  });
}

export async function generateStaticParams() {
  const { db } = await connectToDatabase();
  const pages = (await db.collection("news").find().toArray()).filter(
    (item) => item.isPublished
  );

  return pages.map((page) => ({
    domain: page.domain,
    slug: page.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  
  const { db } = await connectToDatabase();
  const page = await db
    .collection("news")
    .findOne({ domain: params.domain, slug: params.slug });
    
  const indexCollection = db.collection("index");
  const relatedPagesDoc = await indexCollection.findOne<RelatedPagesDocument>({
    page: page.canonical_url,
  });
  const authorFromDB = await db.collection("authors").findOne({ authorId: page.authorId });
  const { _id, ...serializedAuthor } = authorFromDB; // This removes _id from the result
const author:AuthorProfile=serializedAuthor
  if (!author) {
    notFound();
  }
  const relatedPages = relatedPagesDoc?.relatedPages;

  // selectiveLogger.info("/learn loaded successfully");
  if (!page) {
    notFound();
  }
  if (!page.isPublished) {
    notFound();
  }

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",  // Change Article to NewsArticle for news-specific schema
    headline: page?.title || "Default Title", // Fallback for title
    description: page?.meta_description || "Default description", // Fallback for meta description
    author: {
      "@type": "Person",
      name: author.name || "Unknown Author", // Fallback name if author is missing
      url: author.socialLinks?.link || "", // Optional URL for the author
    },
    creator: {
      "@type": "Person",
      name: author.name || "Unknown Creator", // Fallback for creator
      url: author.socialLinks?.link || "", // Optional URL for the creator
    },
    datePublished: page?.created_at || new Date().toISOString(), // Set publish date as created_at
    dateModified: page?.updated_at || new Date().toISOString(), // Use dateModified for update timestamp
    publisher: {
      "@type": "Organization",
      name: "basicUtils.com", // Name of the publisher
      logo: {
        "@type": "ImageObject",
        url: "https://basicutils.com/logo.png", // URL to the publisher's logo
      },
      url: "https://basicutils.com",  // Optional: URL of the publisher's website
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": page?.url || "https://defaulturl.com", // The URL of the news article
    },
    image: page?.image || "https://basicutils.com/default-image.jpg",  // Optional image for the article
    keywords: page?.keywords || "news, default, article", // Keywords for the article (optional)
    // articleSection: page?.section || "General", // Optional: Section/category of the article
    inLanguage: page?.language || "en", // Optional: Language of the article
  };
  
  
  
  const hasFaqData = Array.isArray(page.faqs) && page.faqs.length > 0;

  const faqJsonLd = hasFaqData
  ?{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }:null;

  if (page.image_url) {
    jsonLd.image = {
      "@type": "ImageObject",
      url: page.image_url,
    };
  }
 
  if (page.canonical_url) {
    jsonLd.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": page.canonical_url,
    };
  }

  const relatedPagesJsonLd = relatedPages
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: relatedPages
          .filter((relatedPage) => relatedPage.url && relatedPage.title) // Filter out items with missing url or title
          .map((relatedPage, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: relatedPage.url, // URL of the related page
            name: relatedPage.title, // Title of the related page
          })),
      }
    : null;

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
  const typedRef:BibliographyState=page.refs
  const typedUrl:string=page.canonical_url
  const typedFAQS:FAQ[]=page.faqs
  


  return (
    <>
      {websiteJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      )}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
       {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {relatedPagesJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(relatedPagesJsonLd),
          }}
        />
      )}
      

      <BlogComponentContainer
      type="news"
  author={author}
  url={page?.canonical_url || ""}
  relatedPages={relatedPages || []}
  refs={page?.refs || {}}
  content={page?.content || ""}
  parentPath={page?.parentPath || ""}
  thisPagePath={page?.thisPagePath || ""}
  faqs={page?.faqs || []}
  
  // dates={{created:page.created_at,modified:page.updated_at }}
/>

    </>
  );
}  