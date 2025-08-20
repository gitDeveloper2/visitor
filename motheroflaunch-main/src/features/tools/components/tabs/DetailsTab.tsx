"use client";

import {
  Box,
  Chip,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { ICategory } from "@features/tools/models/Category";
import { Types } from "mongoose";

type Props = {
  tool: {
    websiteUrl: string;
    category?: ICategory | Types.ObjectId;
    tags?: string;
    platforms?: string[];
    launchDate?: string | Date;
    githubUrl?: string;
    twitterUsername?: string;
    company?: string;
    openSource?: boolean;
  };
};

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DetailsTab({ tool }: Props) {
  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {/* Website */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Website
          </Typography>
          <Link href={tool.websiteUrl} target="_blank" rel="noopener" underline="hover">
            {tool.websiteUrl}
            <LaunchIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: "middle" }} />
          </Link>
        </Grid>

        {/* Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Category
          </Typography>
          <Typography variant="body1">
  {tool.category && typeof tool.category === 'object' && 'name' in tool.category
    ? tool.category.name
    : '—'}
</Typography>



        </Grid>

        {/* Tags */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Tags
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(tool.tags?.split(",").map((tag) => tag.trim()) || []).map((tag, i) => (
              <Chip key={i} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>
        </Grid>

        {/* Platforms */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Platforms
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(tool.platforms || []).map((platform, i) => (
              <Chip key={i} label={platform} size="small" />
            ))}
          </Stack>
        </Grid>

        {/* Launch Date */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Launch Date
          </Typography>
          <Typography variant="body1">
            {tool.launchDate ? formatDate(tool.launchDate) : "—"}
          </Typography>
        </Grid>

        {/* Open Source */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Open Source
          </Typography>
          <Typography variant="body1">{tool.openSource ? "Yes" : "No"}</Typography>
        </Grid>

        {/* GitHub */}
        {tool.githubUrl && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              GitHub
            </Typography>
            <Link href={tool.githubUrl} target="_blank" rel="noopener" underline="hover">
              {tool.githubUrl}
              <LaunchIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: "middle" }} />
            </Link>
          </Grid>
        )}

        {/* Twitter */}
        {tool.twitterUsername && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Twitter
            </Typography>
            <Link
              href={`https://twitter.com/${tool.twitterUsername}`}
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              @{tool.twitterUsername}
              <LaunchIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: "middle" }} />
            </Link>
          </Grid>
        )}

        {/* Company */}
        {tool.company && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Company
            </Typography>
            <Typography variant="body1">{tool.company}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
