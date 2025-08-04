import React from 'react';
import AboutUs from '@components/support_pages/AboutUsComponent';
import { generatePageMetadata } from '@lib/MetadataGenerator';
import StarsComponent from '@/features/compare/components/StarsComponent';
export async function generateMetadata() {
  return generatePageMetadata({
    title: "Easy Ip Display",
    description: "Learn about our firefox add on to easily view your current IP address",
    keywords: "firefox add on, ip display",
    canonicalUrl:"/easy_ip_display"
  });
}
const Page: React.FC = () => {
  return (
    <StarsComponent/>
  );
}

export default Page;
