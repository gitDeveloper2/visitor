"use client";

import { useEffect, useState } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Box, Typography, Button } from "@mui/material";
import { loadFacebookSDK } from "../hooks/useFacebookSDK";

const FacebookShareButton = ({ url, message }: { url: string, message: string }) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    loadFacebookSDK().then(() => {
      setSdkLoaded(true);
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse();
      }
    });
  }, [url]);

  const handleShare = () => {
    if (window.FB) {
      window.FB.ui({
        method: "share",
        href: url,
        quote: message, // Pass the custom message here
      }, (response: any) => {
        if (response && !response.error_message) {
        } else {
        }
      });
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <FacebookIcon fontSize="small" color="primary" />
      {sdkLoaded ? (
        <Button variant="outlined" onClick={handleShare}>
          Share on Facebook
        </Button>
      ) : (
        <Typography variant="body2">Loading Facebook...</Typography>
      )}
    </Box>
  );
};

export default FacebookShareButton;
