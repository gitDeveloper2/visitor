"use client";

import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Calendar, Clock, Eye, ThumbsUp } from "lucide-react";
import Badge from "@components/badges/Badge";
import { getShadow } from "../../../../../utils/themeUtils";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorEmail: string;
  author: string;
  role: string;
  authorBio: string;
  founderUrl: string;
  isInternal: boolean;
  isFounderStory: boolean;
  status: 'pending' | 'approved' | 'rejected';
  readTime?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  views?: number;
  likes?: number;
  slug?: string;
  category?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

interface TagBlogListProps {
  blogs: BlogPost[];
  tag: string;
}

export default function TagBlogList({ blogs, tag }: TagBlogListProps) {
  const theme = useTheme();

  const renderBlogCard = (blog: BlogPost) => {
    const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...';
    const readTime = blog.readTime || Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(' ').length / 200);

    return (
      <Paper
        key={blog._id}
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: getShadow(theme, "elegant"),
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: getShadow(theme, "neon"),
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1, mr: 2, lineHeight: 1.3 }}>
            {blog.title}
          </Typography>
          {blog.isFounderStory && (
            <Badge variant="founder" label="Founder" />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flex: 1 }}
        >
          {excerpt}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {blog.tags.slice(0, 3).map((blogTag) => (
            <Chip
              key={blogTag}
              label={blogTag}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Avatar alt={blog.author} sx={{ width: 24, height: 24 }} />
          <Typography variant="caption" fontWeight={600}>
            {blog.author}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "text.secondary",
            fontSize: "0.75rem",
            mt: "auto",
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={14} />
              {readTime} min read
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {blog.views && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Eye size={14} />
                {blog.views}
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={14} />
              {blog.likes || 0}
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <Box>
      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Link href={`/blogs/${blog.slug || blog._id}`} style={{ textDecoration: 'none' }}>
              {renderBlogCard(blog)}
            </Link>
          </Grid>
        ))}
      </Grid>
      
      {blogs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No blogs found with tag "{tag}"
          </Typography>
          <Button
            component={Link}
            href="/blogs"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Back to All Blogs
          </Button>
        </Box>
      )}
    </Box>
  );
}
