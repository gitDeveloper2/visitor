import React, { Suspense } from 'react';
import { generatePageMetadata } from '@lib/MetadataGenerator';
import NpmComponent from '@/features/compare/components/NpmComponent';
import NpmStarsArticle from './Content';
import { Box } from '@mui/material';
import  MainContentSkeleton  from '@/features/compare/components/skeletons/MainSKeleton';

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "NpmStars: Compare npm Trends and GitHub Stars Together",
  url: "https://basicutils.com/npmstars",
  description:
    "Compare npm downloads and GitHub stars in one place with NpmStars — a powerful tool for tracking open source package trends and developer insights.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://basicutils.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "NpmStars",
        item: "https://basicutils.com/npmstars",
      },
    ],
  },
};

const jsonLdSoftwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NpmStars",
  operatingSystem: "Web-based",
  applicationCategory: "DeveloperApplication",
  url: "https://basicutils.com/npmstars",
  description:
    "NpmStars allows developers to compare npm downloads and GitHub stars for open source packages. Gain insights into project popularity and trends effortlessly.",

};

export async function generateMetadata() {
  return generatePageMetadata({
    title: "NpmStars: Compare npm Trends and GitHub Stars Together",
    description:
      "Compare npm downloads and GitHub stars in one place with NpmStars — a powerful tool for tracking open source package trends and developer insights.",
    keywords:
      "npmtrends alternative, star-history alternative, compare npm downloads and github stars, npm trends and github stars, compare npm package popularity, npm package comparison tool, open source package popularity, visualize npm downloads, github stars over time, developer tool to compare npm packages, track github stars, npm download trends, npm popularity graph, open source metrics dashboard, open source analytics, compare open source projects, npm package analytics, npmstars, basicutils npmstars, github stars analytics",
    canonicalUrl: "/npmstars",
  });
}

const Page: React.FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSoftwareApplication),
        }}
      />
      <Box sx={{ mb: 10 }}>
      <Suspense fallback={<MainContentSkeleton/>}>

        <NpmComponent />
        </Suspense>
      </Box>
      <NpmStarsArticle />
     
    </>
  );
};

export default Page;
