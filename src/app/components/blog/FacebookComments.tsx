// components/FacebookComments.tsx
import { useEffect } from "react";
import Script from "next/script";

const APPID=process.env.NEXT_PUBLIC_FACEBOOK_APPID
const commentsUrl=`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0&appId=${APPID}`
interface FacebookCommentsProps {
  title: string;
  url: string;
  numPosts?: number;
  width?: string;
  children?: React.ReactNode; // Allow any children to be passed to the component
}

const FacebookComments: React.FC<FacebookCommentsProps> = ({ title, url, numPosts = 5, width = "", children }) => {
  useEffect(() => {
    // Ensure Facebook SDK is initialized for XFBML elements
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <section>
      {/* Optional title */}
      <h2>{title}</h2>

      {/* Optional children content */}
      {children}

      {/* Facebook Comments section */}
      <div className="fb-comments" data-href={url} data-width={width} data-numposts={numPosts}></div>

      {/* Facebook SDK script */}
      <Script
        async
        defer
        crossOrigin="anonymous"
        src={commentsUrl}
      />
    </section>
  );
};

export default FacebookComments;
