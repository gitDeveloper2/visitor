"use client";

import React from "react";
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
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CalendarMonth, AccessTime, Person, School, Tag } from "@mui/icons-material";
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

  const wordCount = page.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.background.default,
          py: { xs: 4, sm: 6 }, // shorter hero
          position: 'relative',
          overflow: 'hidden',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Background Effects with softer opacity */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: theme.custom?.gradients?.hero || 'linear-gradient(135deg, hsl(263 70% 50%) 0%, hsl(220 70% 50%) 50%, hsl(280 70% 50%) 100%)',
            opacity: theme.palette.mode === 'light' ? 0.03 : 0.06,
            zIndex: 0
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant'), borderRadius: 2 }}>
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

          <Grid item xs={12} md={4}>
            {/* Related Pages */}
            {relatedPages && relatedPages.length > 0 && (
              <Paper elevation={0} sx={{ p: 3, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant'), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Related Articles</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {relatedPages.slice(0, 5).map((relatedPage: any, index: number) => (
                    <Box key={index}>
                      <Typography variant="body2" component="a" href={relatedPage.url} sx={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                        {relatedPage.title}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LearnPageClient; 