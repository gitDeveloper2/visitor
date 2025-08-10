"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Calendar, Clock, Github, Linkedin, ThumbsUp, Twitter } from "lucide-react";
import { useParams } from "next/navigation";

import {
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../../utils/themeUtils";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
  // Additional fields from forms
  author?: string;
  role?: string;
  authorBio?: string;
  founderUrl?: string;
  isInternal?: boolean;
  isFounderStory?: boolean;
  readTime?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

type SocialHandles = {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };

  type BlogArticleProps = {
    author: string;
    role: string;
    authorBio?: string;
    socialHandles?: SocialHandles;  // new prop
    title: string;
    date: string;
    readTime: string;
    views: number;
    likes: number;
    tags: string[];
    content: string; // Changed from React.ReactNode to string for TipTap HTML
  };

export default function BlogPageWrapper() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      if (!params.id) return;
      
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user-blogs/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data.blog);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          {error || "Blog not found"}
        </Alert>
      </Container>
    );
  }

  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <BlogArticlePage
      author={blog.author || blog.authorName}
      role={blog.role || "Author"}
      authorBio={blog.authorBio || "Passionate developer and writer sharing insights about modern web development."}
      socialHandles={{
        twitter: "author_twitter",
        linkedin: "author-linkedin",
        github: "author-github"
      }}
      title={blog.title}
      date={date}
      readTime={blog.readTime ? `${blog.readTime} min read` : "5 min read"}
      views={0}
      likes={0}
      tags={blog.tags}
      content={blog.content}
    />
  );
}

 function BlogArticlePage({
    author,
    role,
    authorBio,
    socialHandles,
    title,
    date,
    readTime,
    views,
    likes,
    tags,
    content,
}: BlogArticleProps) {
  const theme = useTheme();

  // Function to render TipTap HTML content
  const renderTipTapContent = (htmlContent: string) => {
    return (
      <Box
        sx={{
          '& h1': {
            fontSize: '2rem',
            fontWeight: 700,
            mb: 2,
            mt: 4,
          },
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 600,
            mb: 1.5,
            mt: 3,
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: 600,
            mb: 1,
            mt: 2.5,
          },
          '& p': {
            mb: 2,
            lineHeight: 1.7,
          },
          '& ul, & ol': {
            mb: 2,
            pl: 3,
          },
          '& li': {
            mb: 0.5,
          },
          '& blockquote': {
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            pl: 2,
            ml: 0,
            my: 2,
            fontStyle: 'italic',
            color: 'text.secondary',
          },
          '& code': {
            backgroundColor: theme.palette.grey[100],
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.9em',
            fontFamily: 'monospace',
          },
          '& pre': {
            backgroundColor: theme.palette.grey[100],
            padding: '1rem',
            borderRadius: '8px',
            overflowX: 'auto',
            mb: 2,
            '& code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
          '& a': {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& strong': {
            fontWeight: 600,
          },
          '& em': {
            fontStyle: 'italic',
          },
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <Box component="main" sx={{ bgcolor: theme.palette.background.default, py: 10 }}>
      <Container maxWidth="md">
        {/* Article Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h2" sx={typographyVariants.sectionTitle}>
            {title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 1,
            }}
          >
            <Avatar alt={author} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {author}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {role}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 2,
              color: "text.secondary",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={16} />
              <Typography variant="caption">{date}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={16} />
              <Typography variant="caption">{readTime}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={16} />
              <Typography variant="caption">{likes}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 4 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
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

        {/* Article Content */}
        <Box sx={{ mb: 6 }}>
          {renderTipTapContent(content)}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Author Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar alt={author} sx={{ width: 80, height: 80, mx: "auto", mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {author}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {authorBio}
          </Typography>
          {socialHandles && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {socialHandles.twitter && (
                <Button
                  component="a"
                  href={`https://twitter.com/${socialHandles.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<Twitter size={20} />}
                  size="small"
                  variant="outlined"
                >
                  Twitter
                </Button>
              )}
              {socialHandles.linkedin && (
                <Button
                  component="a"
                  href={`https://linkedin.com/in/${socialHandles.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<Linkedin size={20} />}
                  size="small"
                  variant="outlined"
                >
                  LinkedIn
                </Button>
              )}
              {socialHandles.github && (
                <Button
                  component="a"
                  href={`https://github.com/${socialHandles.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<Github size={20} />}
                  size="small"
                  variant="outlined"
                >
                  GitHub
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
} 