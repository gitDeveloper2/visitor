"use client";

import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Twitter, Facebook, LinkedIn, Email } from "@mui/icons-material";
import { FC } from "react";

interface ConnectWithAuthorProps {
  name: string;
  twitterUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

const ConnectWithAuthor: FC<ConnectWithAuthorProps> = ({
  name,
  twitterUrl,
  facebookUrl,
  linkedinUrl,
  email,
}) => {
  return (
    <Box sx={{ textAlign: "center", marginTop: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Connect with {name}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {twitterUrl && (
          <Tooltip title="Follow on Twitter">
            <IconButton
              component="a"
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow ${name} on Twitter`}
            >
              <Twitter fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
        {facebookUrl && (
          <Tooltip title="Follow on Facebook">
            <IconButton
              component="a"
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow ${name} on Facebook`}
            >
              <Facebook fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
        {linkedinUrl && (
          <Tooltip title="Connect on LinkedIn">
            <IconButton
              component="a"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Connect with ${name} on LinkedIn`}
            >
              <LinkedIn fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
        {email && (
          <Tooltip title="Send an Email">
            <IconButton
              component="a"
              href={`mailto:${email}`}
              aria-label={`Send an email to ${name}`}
            >
              <Email fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default ConnectWithAuthor;
