import { generatePageMetadata } from '@lib/MetadataGenerator'; 
import Metrics from '@components/libs/Metrics';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Metrics",
    description: "metrics",
    keywords: "",
    canonicalUrl:"/metrics"
  });
}
const Page: React.FC = () => {
  

  return (
    <Metrics/>
  );
};

export default Page;
