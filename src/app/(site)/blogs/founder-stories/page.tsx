"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Avatar,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search, Clock, ThumbsUp } from "lucide-react";
import Badge from "@components/badges/Badge";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "../../../../utils/themeUtils";
import FounderStoryCard from "../page";

// Mock data
const founderStories = [
  {
    id: "fs-1",
    author: "Jane Doe",
    title: "How I built Snippet Saver — the tiny tool that saved our team's time",
    excerpt: "I started Snippet Saver after repeatedly losing useful code fragments between projects. In this story I walk through the early tradeoffs, the first 100 users, and how we designed the tagging model.",
    date: "Mar 12, 2024",
    readTime: "6 min read",
    avatarUrl: "/images/authors/jane.png",
  },
  {
    id: "fs-2",
    author: "Liam Patel",
    title: "From Side Project to Startup: The DevFlow Journey",
    excerpt: "How I turned my weekend project into a thriving dev tool used by thousands of developers worldwide.",
    date: "Feb 12, 2024",
    readTime: "6 min read",
    avatarUrl: "/images/authors/liam.png",
  },
  // ... more stories
];

interface FounderStoryCardProps {
  author: string;
  title: string;
  excerpt: string;
  avatarUrl: string;
  date: string;
  readTime: string;
}



export default function FounderStoriesPage() {
  const theme = useTheme();
  const [search, setSearch] = React.useState("");

  // Filter logic stub
  const filteredStories = founderStories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", mb: 6 }}>
  <Typography variant="h2" sx={typographyVariants.sectionTitle}>
    Founder{" "}
    <Box component="span" sx={commonStyles.textGradient}>
      Stories
    </Box>
  </Typography>
  <Typography
    variant="h6"
    sx={{
      color: "text.secondary",
      mt: 2,
      maxWidth: 720,
      mx: "auto",
    }}
  >
    Real journeys from developers who built tools, startups, and side projects that scaled.
  </Typography>
</Box>

        




        <Paper
          elevation={0}
          sx={{
            mb: 6,
            px: 2,
            py: 3,
            borderRadius: "1rem",
            ...getGlassStyles(theme),
            display: "flex",
            justifyContent: "center",
            boxShadow: getShadow(theme, "elegant"),
          }}
        >
          <TextField
            size="small"
            placeholder="Search founder stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Paper>

        <Grid container spacing={4}>
          {filteredStories.map((story) => (
            <Grid item xs={12} sm={6} md={4} key={story.id}>
              <FounderStoryCard showBadge={false} {...story}  />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
