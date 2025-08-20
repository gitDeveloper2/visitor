"use client";

import {
  Avatar,
  Box,
  Card,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";

type Creator = {
  name: string;
  avatarUrl: string;
  headline?: string;
  bio?: string;
  githubUsername?: string;
  twitterUsername?: string;
  websiteUrl?: string;
};

type OtherTool = {
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string;
};

type Props = {
  creator: Creator;
  otherTools: OtherTool[];
};

export default function MakerTab({ creator, otherTools }: Props) {
  return (
    <Box mt={2}>
      {/* Maker Info */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={creator.avatarUrl}
          alt={creator.name}
          sx={{ width: 64, height: 64 }}
        />
        <Box>
          <Typography variant="h6">{creator.name}</Typography>
          {creator.headline && (
            <Typography variant="body2" color="text.secondary">
              {creator.headline}
            </Typography>
          )}
        </Box>
      </Box>

      {creator.bio && (
        <Typography mt={2} variant="body1">
          {creator.bio}
        </Typography>
      )}

      {/* Social Links */}
      <Stack direction="row" spacing={2} mt={2}>
        {creator.websiteUrl && (
          <Link href={creator.websiteUrl} target="_blank" rel="noopener">
            <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
            Website
          </Link>
        )}
        {creator.githubUsername && (
          <Link
            href={`https://github.com/${creator.githubUsername}`}
            target="_blank"
            rel="noopener"
          >
            <GitHubIcon fontSize="small" sx={{ mr: 0.5 }} />
            GitHub
          </Link>
        )}
        {creator.twitterUsername && (
          <Link
            href={`https://twitter.com/${creator.twitterUsername}`}
            target="_blank"
            rel="noopener"
          >
            <TwitterIcon fontSize="small" sx={{ mr: 0.5 }} />
            Twitter
          </Link>
        )}
      </Stack>

      {/* Other Tools */}
      {otherTools.length > 0 && (
        <Box mt={5}>
          <Typography variant="subtitle1" gutterBottom>
            Other Tools by {creator.name}
          </Typography>
          <Grid container spacing={2}>
            {otherTools.map((tool, idx) => (
              <Grid size={{xs:12,sm:6,md:4}} key={idx} >
                <Card
                  variant="outlined"
                  sx={{ display: "flex", alignItems: "center", p: 2 }}
                >
                  <Avatar
                    src={tool.logoUrl}
                    alt={tool.name}
                    variant="rounded"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box>
                    <Link href={`/tools/${tool.slug}`} underline="hover">
                      <Typography fontWeight="bold">{tool.name}</Typography>
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                      {tool.tagline}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
