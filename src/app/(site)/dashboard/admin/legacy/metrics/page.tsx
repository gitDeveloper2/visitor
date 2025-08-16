import { generatePageMetadata } from '@lib/MetadataGenerator'; 
import Metrics from '@components/libs/Metrics';

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
