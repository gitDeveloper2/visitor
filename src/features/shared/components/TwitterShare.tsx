"use client";

import { Twitter } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export const TwitterShareButton = ({
  url,
  text,
  hashtags = [],
}: {
  url: string;
  text?: string;
  hashtags?: string[];
}) => {
  const shareUrl = new URL("https://twitter.com/intent/tweet");
  shareUrl.searchParams.set("url", url);
  if (text) shareUrl.searchParams.set("text", text);
  if (hashtags.length > 0) shareUrl.searchParams.set("hashtags", hashtags.join(","));

  return (

    <Box display="flex" alignItems="center" gap={1}>
    <Twitter fontSize="small" color="primary" />
   
      <Button rel="noopener" target="_blank" href={shareUrl.toString()} variant="outlined" >
        Share on Twitter
      </Button>
     
  </Box>)

};
