import { connectToDatabase } from "../../../../../lib/mongodb";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "../../../../../lib/MetadataGenerator";
import { RelatedPagesDocument } from "../../../../components/blog/BloogComponentContainer";
import { AuthorProfile } from "../../../../../types/Author";
import { FAQ } from "@/app/components/libs/faqReducer";
import LearnPageClient from "./LearnPageClient";

export const revalidate = 345600;

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}): Promise<Metadata> {
  const { db } = await connectToDatabase();
  const page = await db
    .collection("pages")
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
    ...(page.updated_at && { updatedAt: page.updated_at }),
  });
}

export async function generateStaticParams() {
  const { db } = await connectToDatabase();
  const pages = (await db.collection("pages").find().toArray()).filter(
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
    .collection("pages")
    .findOne({ domain: params.domain, slug: params.slug });
  
  if (!page) {
    notFound();
  }
  
  if (!page.isPublished) {
    notFound();
  }

  const indexCollection = db.collection("index");
  const relatedPagesDoc = await indexCollection.findOne<RelatedPagesDocument>({
    page: page.canonical_url,
  });
  
  const authorFromDB = await db.collection("authors").findOne({ authorId: page.authorId });
  if (!authorFromDB) {
    notFound();
  }
  const { _id, ...serializedAuthor } = authorFromDB;
  const author: AuthorProfile = serializedAuthor as any;
  
  const relatedPages = relatedPagesDoc?.relatedPages || [];

  // Serialize Mongo/BSON objects to plain JSON-safe objects
  const safePage = JSON.parse(JSON.stringify(page));
  const safeAuthor = JSON.parse(JSON.stringify(author));
  const safeRelated = JSON.parse(JSON.stringify(relatedPages));

  // JSON-LD
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title || "Default Title",
    description: page.meta_description || "Default description",
    author: {
      "@type": "Person",
      name: author.name,
      url: (author as any).socialLinks?.link || "",
    },
    creator: {
      "@type": "Person",
      name: author.name,
      url: (author as any).socialLinks?.link || "",
    },
    datePublished: page.created_at || new Date().toISOString(),
    created_at: page.created_at || new Date().toISOString(),
    updated_at: page.updated_at || new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "basicUtils.com",
      logo: {
        "@type": "ImageObject",
        url: "https://basicutils.com/logo.png",
      },
    },
  };

  const hasFaqData = Array.isArray(page.faqs) && page.faqs.length > 0;

  const faqJsonLd = hasFaqData
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": page.faqs.map((faq: FAQ) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    : null;

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

  const relatedPagesJsonLd = relatedPages.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: relatedPages
          .filter((relatedPage) => relatedPage.url && relatedPage.title)
          .map((relatedPage, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: relatedPage.url,
            name: relatedPage.title,
          })),
      }
    : null;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://basicutils.com",
    name: "basicutils.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://basicutils.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

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
      
      <LearnPageClient 
        page={safePage}
        author={safeAuthor}
        relatedPages={safeRelated}
      />
    </>
  );
} 