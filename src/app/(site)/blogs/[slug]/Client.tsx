"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Calendar, Clock, Github, Linkedin, ThumbsUp, Twitter } from "lucide-react";

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  authorName?: string;
  authorEmail?: string;
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
};

type SocialHandles = {
  twitter?: string;
  linkedin?: string;
  github?: string;
};

type BlogArticleProps = {
  author: string;
  role: string;
  authorBio?: string;
  socialHandles?: SocialHandles;
  title: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  tags: string[];
  content: string;
};

export default function Client({ blog }: { blog: BlogPost }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            mb: 2,
            display: 'block',
            mx: 'auto',
            boxShadow: theme.shadows[2],
          },
        }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    );
  };

  return (
    <Box component="main" sx={{ bgcolor: theme.palette.background.default, py: { xs: 4, sm: 6, md: 10 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
              lineHeight: { xs: 1.2, sm: 1.1 },
              mb: { xs: 2, sm: 3 }
            }}
          >
            {blog.title}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mt: 1 }}>
            <Avatar alt={blog.author || blog.authorName || "Author"} sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }} />
            <Box>
              <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {blog.author || blog.authorName || "Author"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {blog.role || "Author"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 2, sm: 3 }, mt: 2, color: "text.secondary", flexWrap: 'wrap' }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={isMobile ? 14 : 16} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{new Date(blog.createdAt).toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={isMobile ? 14 : 16} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{`${blog.readTime || 5} min read`}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbsUp size={isMobile ? 14 : 16} />
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{0}</Typography>
            </Box>
          </Box>
          
          {blog.imageUrl && (
            <Box 
              sx={{ 
                mt: 4,
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                maxWidth: '100%',
                mx: 'auto',
                position: 'relative',
                '&::after': {
                  content: '""',
                  display: 'block',
                  pt: '56.25%', // 16:9 aspect ratio
                },
                '& img': {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }
              }}
            >
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                loading="lazy"
              />
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: { xs: 3, sm: 4 }, flexWrap: 'wrap' }}>
          {blog.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          {renderTipTapContent(blog.content)}
        </Box>

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
          <Avatar alt={blog.author || blog.authorName || "Author"} sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mx: "auto", mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            {blog.author || blog.authorName || "Author"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' }, px: { xs: 2, sm: 0 } }}>
            {blog.authorBio || ''}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
            <Button component="a" href={`https://twitter.com/${''}`} target="_blank" rel="noopener noreferrer" startIcon={<Twitter size={isMobile ? 16 : 20} />} size="small" variant="outlined">Twitter</Button>
            <Button component="a" href={`https://linkedin.com/in/${''}`} target="_blank" rel="noopener noreferrer" startIcon={<Linkedin size={isMobile ? 16 : 20} />} size="small" variant="outlined">LinkedIn</Button>
            <Button component="a" href={`https://github.com/${''}`} target="_blank" rel="noopener noreferrer" startIcon={<Github size={isMobile ? 16 : 20} />} size="small" variant="outlined">GitHub</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

