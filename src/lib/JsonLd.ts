const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://basicutils.com";

type BreadcrumbItem = { name: string; url: string };

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    name: "basicutils.com",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleJsonLd(params: {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const {
    title,
    description,
    canonicalUrl,
    imageUrl = `${baseUrl}/logo.png`,
    authorName = "BasicUtils",
    datePublished,
    dateModified,
  } = params;

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "basicUtils.com",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    author: {
      "@type": "Person",
      name: authorName,
    },
  };

  if (imageUrl) {
    (jsonLd as any).image = {
      "@type": "ImageObject",
      url: imageUrl,
    };
  }

  if (datePublished) {
    (jsonLd as any).datePublished = datePublished;
  }
  if (dateModified) {
    (jsonLd as any).dateModified = dateModified;
  }

  return jsonLd;
}

export function getAbsoluteUrl(path: string) {
  if (!path) return baseUrl;
  if (path.startsWith("http")) return path;
  return `${baseUrl}${path}`;
}

export { baseUrl };

