import { Metadata } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import { buildWebsiteJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, getAbsoluteUrl } from "../../../../lib/JsonLd";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { db } = await connectToDatabase();
  const blog = await db.collection("userblogs").findOne({ slug: params.slug, status: "approved" });

  if (!blog) {
    return generatePageMetadata({
      title: "Blog not found",
      description: "",
      canonicalUrl: `/blogs/${params.slug}`,
      type: "article",
    }) as any;
  }

  const title = blog.title || "Blog";
  const description = blog.excerpt || blog.content?.slice(0, 160) || "";
  const canonical = `/blogs/${blog.slug}`;
  const updatedAt = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined;
  const image = blog.imageUrl || undefined;

  return generatePageMetadata({
    title,
    description,
    canonicalUrl: canonical,
    updatedAt,
    type: "article",
    imageUrlOverride: image,
  }) as any;
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
