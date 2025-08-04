import { Metadata } from "next";
// import NetPayForm from "@/components/features/netpay/NetPayForm";
// import { generatePageMetadata } from "@/utils/generators/metadata";
import NetPayForm from "@components/netpay/NetPayForm";
// import SEOPage from "@/components/features/netpay/SEOPage";


const Page: React.FC = () => {
  return (
    <>
     
      <>
      <NetPayForm />
      {/* <SEOPage/> */}
      </>
      
    </>
  );
};

export default Page;
