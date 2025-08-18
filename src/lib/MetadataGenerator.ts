interface PageMetaProps {
  title: string;
  description: string;
  keywords?: string; // Optional keywords
  canonicalUrl:string;
  updatedAt?:string;
  type?: "website" | "article";
  imageUrlOverride?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://basicutils.com";
const imageUrl = process.env.NEXT_PUBLIC_IMAGE_PATH || "/logo.png";



const author = "Joseph Horace";
const robots = "index, follow";

export function generatePageMetadata({ title, description, keywords, canonicalUrl,updatedAt, type, imageUrlOverride }: PageMetaProps) {
 canonicalUrl=`${baseUrl}${canonicalUrl}`
  return {
    
    title,
    description,
    openGraph: {

      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrlOverride || imageUrl,
          width: 800,
          height: 600,
          alt: 'Og Image Alt',
        },
      ],
      siteName: "Basic Utils",
      type: type || "website",
      locale: "en_US",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrlOverride || imageUrl],
      site: "@BasicUtils",
      creator: "@BasicUtils",
    },
    metadataBase: new URL(`${baseUrl}/fal`),
    keywords,
    canonicalUrl,
    author,
    robots,
    alternates:{
      canonical: `${canonicalUrl}`
    },
    other: {
      ...(updatedAt && { 'last-modified': updatedAt }), // Only add 'last-modified' if updatedAt is provided
    },

  };
}
