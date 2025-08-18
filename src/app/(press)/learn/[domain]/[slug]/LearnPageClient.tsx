"use client";

import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
  Grid,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CalendarMonth, AccessTime, Person, School, Tag, Home, ChevronRight, Link as LinkIcon } from "@mui/icons-material";
import { getGlassStyles, getShadow } from "../../../../../utils/themeUtils";
import { useTheme } from "@mui/material/styles";

interface LearnPageClientProps {
  page: any;
  author: any;
  relatedPages: any[];
}

const LearnPageClient: React.FC<LearnPageClientProps> = ({
  page,
  author,
  relatedPages,
}) => {
  const theme = useTheme();

  // Normalize legacy TOC (h2#toc-header + ol#toc) to single-container #toc
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const wrapper = document.querySelector('#learn-wrapper');
    if (!wrapper) return;
    const legacyHeader = wrapper.querySelector('h2#toc-header');
    if (!legacyHeader) return;
    const next = legacyHeader.nextElementSibling as HTMLElement | null;
    if (!next) return;
    if (next.tagName.toLowerCase() === 'ol' && next.id === 'toc') {
      const tocContainer = document.createElement('div');
      tocContainer.id = 'toc';
      tocContainer.className = 'toc';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'toc-header';
      headerDiv.textContent = legacyHeader.textContent || 'Table of Contents';

      const list = next.cloneNode(true) as HTMLOListElement;
      list.classList.add('toc-list');
      list.removeAttribute('id');

      tocContainer.appendChild(headerDiv);
      tocContainer.appendChild(list);

      legacyHeader.replaceWith(tocContainer);
      next.remove();
    }
  }, [page?.content]);

  const wordCount = page.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.background.default,
          py: { xs: 4, sm: 6 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Effects with softer opacity and mask fade */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: theme.custom?.gradients?.hero || 'linear-gradient(135deg, hsl(263 70% 50%) 0%, hsl(220 70% 50%) 50%, hsl(280 70% 50%) 100%)',
            opacity: theme.palette.mode === 'light' ? 0.02 : 0.04,
            zIndex: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* Extra bottom fade to neutral background to remove any seam */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: { xs: 140, sm: 180 },
            pointerEvents: 'none',
            background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${theme.palette.background.default} 85%, ${theme.palette.background.default} 100%)`,
            zIndex: 1,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          {/* Breadcrumbs (inside hero, above title) */}
          <Breadcrumbs aria-label="breadcrumb" separator="/" sx={{ mb: { xs: 1.5, sm: 2 } }}>
            <MuiLink component={Link} href="/" underline="none" color="text.secondary" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Home sx={{ mr: 0.5, fontSize: 16 }} /> Home
            </MuiLink>
            <MuiLink component={Link} href="/learn" underline="none" color="text.secondary" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <School sx={{ mr: 0.5, fontSize: 16 }} /> Learn
            </MuiLink>
            {page.domain ? (
              <MuiLink component={Link} href={`/learn/${page.domain}`} underline="none" color="text.secondary">
                {String(page.domain).charAt(0).toUpperCase() + String(page.domain).slice(1)}
              </MuiLink>
            ) : null}
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>{page.title}</Typography>
          </Breadcrumbs>

          {/* Badge + Title + Meta */}
          <Paper
            elevation={0}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.25 },
              mb: { xs: 2, sm: 3 },
              borderRadius: "999px",
              ...getGlassStyles(theme),
              boxShadow: getShadow(theme, 'elegant'),
              maxWidth: 'fit-content',
            }}
          >
            <School sx={{ width: 16, height: 16, color: theme.palette.primary.main }} />
            <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.primary.main }}>
              Learning Resource
            </Typography>
          </Paper>

          <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }, fontWeight: 800, lineHeight: 1.2, color: theme.palette.text.primary }}>
            {page.title}
          </Typography>

          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mt: 1.5, maxWidth: 900 }}>
            {page.meta_description}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                {author.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarMonth sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(page.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTime sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                {readTime} min read
              </Typography>
            </Box>
          </Box>

          {page.keywords && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {page.keywords.split(',').map((keyword: string, index: number) => (
                <Chip key={index} label={keyword.trim()} size="small" variant="outlined" sx={{ borderColor: theme.palette.divider }} />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Content Section with author card moved below */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, sm: -8 }, position: 'relative', zIndex: 2, py: { xs: 4, sm: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, backgroundColor: 'transparent', border: 'none', boxShadow: 'none', borderRadius: 2 }}>
              <div id="learn-wrapper">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            </Paper>

            {/* FAQs */}
            {Array.isArray(page.faqs) && page.faqs.length > 0 && (
              <Paper elevation={0} sx={{ mt: 4, p: { xs: 3, sm: 4 }, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant'), borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>FAQs</Typography>
                <Divider sx={{ mb: 2 }} />
                {page.faqs.map((faq: any, idx: number) => (
                  <Accordion key={idx} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            )}

            {/* Author moved below */}
            <Paper elevation={0} sx={{ mt: 4, p: 3, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant'), borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={author.profilePicture} alt={author.name} sx={{ width: 56, height: 56, mr: 2 }}>
                  {author.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{author.name}</Typography>
                  {author.bio && (
                    <Typography variant="body2" color="text.secondary">{author.bio}</Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} sx={{ mt: { xs: 2, sm: 5 } }}>
            {/* Related Pages */}
            {relatedPages && relatedPages.length > 0 && (
              <Paper elevation={0} sx={{ p: 2.5, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant'), borderRadius: 2, position: 'sticky', top: { xs: 16, sm: 24 } }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>Related</Typography>
                <Divider sx={{ mb: 1.5 }} />
                <List dense disablePadding>
                  {relatedPages.slice(0, 6).map((relatedPage: any, index: number) => (
                    <ListItemButton key={index} component="a" href={relatedPage.url} sx={{ borderRadius: 1, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <ListItemText
                        primary={relatedPage.title}
                        primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 600 } }}
                      />
                      <ChevronRight sx={{ fontSize: 18, color: 'text.disabled', ml: 'auto' }} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LearnPageClient; 