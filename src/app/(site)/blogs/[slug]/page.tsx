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
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
  slug: string; // Added slug field
  content: string;
  tags: string[];
  authorName?: string;
  authorEmail?: string;
  // Additional fields from forms
  author?: string;
  role?: string;
  authorBio?: string;
  excerpt?: string;
  imageUrl?: string;
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
      if (!params.slug) return;
      
      setLoading(true);
      setError(null);
      try {
        // Updated to use slug-based API endpoint
        const res = await fetch(`/api/user-blogs/${params.slug}`);
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
  }, [params.slug]); // Changed from params.id to params.slug

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 8 } }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, sm: 8 } }}>
        <Alert severity="error">{error || "Blog not found"}</Alert>
      </Box>
    );
  }

  return (
    <>
      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...require('../../../../lib/JsonLd').buildWebsiteJsonLd(),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            require('../../../../lib/JsonLd').buildBreadcrumbJsonLd([
              { name: 'Home', url: require('../../../../lib/JsonLd').getAbsoluteUrl('/') },
              { name: 'Blogs', url: require('../../../../lib/JsonLd').getAbsoluteUrl('/blogs') },
              { name: blog.title, url: require('../../../../lib/JsonLd').getAbsoluteUrl(`/blogs/${blog.slug}`) },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            require('../../../../lib/JsonLd').buildArticleJsonLd({
              title: blog.title,
              description: blog.excerpt || blog.content?.slice(0, 160) || '',
              canonicalUrl: require('../../../../lib/JsonLd').getAbsoluteUrl(`/blogs/${blog.slug}`),
              imageUrl: blog.imageUrl,
              authorName: blog.author || blog.authorName,
              datePublished: blog.createdAt,
              dateModified: blog.updatedAt,
            })
          ),
        }}
      />

      <BlogArticlePage
      author={blog.author || blog.authorName || "Author"}
      role={blog.role || "Author"}
      authorBio={blog.authorBio}
      title={blog.title}
      date={new Date(blog.createdAt).toLocaleDateString()}
      readTime={`${blog.readTime || 5} min read`}
      views={0} // You can add view tracking later
      likes={0} // You can add like tracking later
      tags={blog.tags}
      content={blog.content}
      />
    </>
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Function to render TipTap HTML content
  const renderTipTapContent = (htmlContent: string) => {
    return (
      <Box
        sx={{
          '& h1': {
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 700,
            mb: 2,
            mt: 4,
          },
          '& h2': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600,
            mb: 1.5,
            mt: 3,
          },
          '& h3': {
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 600,
            mb: 1,
            mt: 2.5,
          },
          '& p': {
            mb: 2,
            lineHeight: 1.7,
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
          '& ul, & ol': {
            mb: 2,
            pl: { xs: 2, sm: 3 },
          },
          '& li': {
            mb: 0.5,
          },
          '& blockquote': {
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            pl: { xs: 1.5, sm: 2 },
            ml: 0,
            my: 2,
            fontStyle: 'italic',
            color: 'text.secondary',
          },
          '& code': {
            backgroundColor: theme.palette.grey[100],
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontSize: { xs: '0.8em', sm: '0.9em' },
            fontFamily: 'monospace',
          },
          '& pre': {
            backgroundColor: theme.palette.grey[100],
            padding: { xs: '0.75rem', sm: '1rem' },
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
    <Box component="main" sx={{ bgcolor: theme.palette.background.default, py: { xs: 4, sm: 6, md: 10 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Article Header */}
        <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            sx={{
              ...typographyVariants.sectionTitle,
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
              lineHeight: { xs: 1.2, sm: 1.1 },
              mb: { xs: 2, sm: 3 }
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              mt: 1,
            }}
          >
            <Avatar alt={author} sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }} />
            <Box>
              <Typography 
                variant="body1" 
                fontWeight={600}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                {author}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {role}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 2, sm: 3 },
              mt: 2,
              color: "text.secondary",
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={isMobile ? 14 : 16} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{date}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={isMobile ? 14 : 16} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{readTime}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={isMobile ? 14 : 16} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{likes}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 1, 
          mb: { xs: 3, sm: 4 },
          flexWrap: 'wrap'
        }}>
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
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          ))}
        </Box>

        {/* Article Content */}
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          {renderTipTapContent(content)}
        </Box>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        {/* Author Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
          <Avatar alt={author} sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mx: "auto", mb: 2 }} />
          <Typography 
            variant={isMobile ? "h6" : "h6"} 
            fontWeight={600} 
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            {author}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            {authorBio}
          </Typography>
          {socialHandles && (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap'
            }}>
              {socialHandles.twitter && (
                <Button
                  component="a"
                  href={`https://twitter.com/${socialHandles.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<Twitter size={isMobile ? 16 : 20} />}
                  size={isMobile ? "small" : "small"}
                  variant="outlined"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
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
                  startIcon={<Linkedin size={isMobile ? 16 : 20} />}
                  size={isMobile ? "small" : "small"}
                  variant="outlined"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
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
                  startIcon={<Github size={isMobile ? 16 : 20} />}
                  size={isMobile ? "small" : "small"}
                  variant="outlined"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
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