"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  getGlassStyles,
  getShadow,
  typographyVariants,
  commonStyles,
} from "../../../../utils/themeUtils";
import { CheckCircle, Star, UploadCloud, FileText, Eye, Award } from "lucide-react";

export default function HowItWorksPage() {
  const theme = useTheme();
  const glass = getGlassStyles(theme);
  const shadow = getShadow(theme, 'elegant');

  const reqApp = [
    'Relevant to dev tools, productivity, AI, utilities',
    'Have a public demo or live link',
    'Include logo, short description, and screenshots',
  ];
  const reqBlog = [
    'Original, unpublished content',
    '800+ words with examples or code snippets',
    'Include title, author name, and short bio',
  ];

  const detailedSteps = [
    {
      step: '01',
      icon: <UploadCloud size={32} color={theme.palette.info.main} />,
      title: 'Submit Your Content',
      desc: 'Upload your app details, screenshots, and descriptions. Or share your expertise through detailed blog posts with our community.',
      points: ['Easy submission form', 'Multiple content types', 'Rich media support'],
    },
    {
      step: '02',
      icon: <Star size={32} color={theme.palette.success.main} />,
      title: 'Quality Review',
      desc: 'Our expert team reviews your submission for quality, relevance, and value to ensure only the best content reaches our audience.',
      points: ['24-hour review process', 'Expert evaluation', 'Constructive feedback'],
    },
    {
      step: '03',
      icon: <FileText size={32} color={theme.palette.warning.main} />,
      title: 'Get Featured',
      desc: 'Once approved, your content goes live and gets featured in our curated directory, reaching thousands of engaged users.',
      points: ['Immediate publication', 'SEO optimization', 'Analytics tracking'],
    },
  ];

  const CardList = ({ items }: { items: string[] }) => (
    <List disablePadding>
      {items.map((item, idx) => (
        <ListItem key={idx} sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
            <CheckCircle size={16} color={theme.palette.success.main} />
          </ListItemIcon>
          <ListItemText primary={item} primaryTypographyProps={{ variant: 'body1' }} />
        </ListItem>
      ))}
    </List>
  );

  const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <Box textAlign="center" mb={6}>
      <Typography variant="h3" >
        {title.split(" ").slice(0, -1).join(" ")} {" "}
        <Box component="span" sx={commonStyles.textGradient(theme)}>
          {title.split(" ").slice(-1)}
        </Box>
      </Typography>
      {subtitle && (
        <Typography variant="h6" sx={{ color: 'text.secondary', mt: 2, maxWidth: 700, mx: 'auto' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box component="main" sx={{ bgcolor: theme.palette.background.default, py: { xs: 6, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          sx={{ ...typographyVariants.MainTitle, textAlign: 'center', mb: 10, ...commonStyles.textGradient(theme) }}
        >
          How It Works
        </Typography>

        <SectionTitle
          title="Simple 3-Step Process"
          subtitle="Easily submit, get reviewed, and go live in just three steps."
        />
        <Grid container spacing={4} sx={{ mb: 12 }}>
          {detailedSteps.map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  ...glass,
                  boxShadow: shadow,
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: getShadow(theme, 'neon') },
                }}
              >
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {item.step}
                </Typography>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.desc}
                </Typography>
                <List disablePadding>
                  {item.points.map((pt, i) => (
                    <ListItem key={i} sx={{ py: 0.5, justifyContent: 'center' }}>
                      <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                        <CheckCircle size={16} color={theme.palette.success.main} />
                      </ListItemIcon>
                      <ListItemText primary={pt} primaryTypographyProps={{ variant: 'caption' }} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <SectionTitle
          title="Unlock Premium Benefits"
          subtitle="Boost visibility and credibility with premium features for apps and blog posts."
        />
        <Grid container spacing={4} sx={{ mb: 12 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 4, ...glass, boxShadow: shadow }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star size={28} color={theme.palette.primary.main} />
                <Typography variant="h6" fontWeight={700} sx={{ ml: 2 }}>Premium Verification</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Stand out with our premium verification badge and get enhanced visibility features that drive more traffic to your content.
              </Typography>
              <List disablePadding sx={{ mb: 2 }}>
                {[<CheckCircle />, <Star />, <Eye />].map((icon, i) => (
                  <ListItem key={i} sx={{ alignItems: 'flex-start', py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                      {React.cloneElement(icon, { size: 20, color: theme.palette.success.main })}
                    </ListItemIcon>
                    <ListItemText
                      primary={[
                        'Verified Badge: Display trust and credibility',
                        'Priority Placement: Featured at the top of listings',
                        'Detailed Analytics: Deep insights into your audience',
                      ][i]}
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box textAlign="center">
                <Button variant="contained" size="large" sx={commonStyles.gradientButton(theme)} href="/launch/submit">
                  Upgrade to Premium
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 4, ...glass, boxShadow: shadow }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Award size={28} color={theme.palette.primary.main} />
                <Typography variant="h6" fontWeight={700} sx={{ ml: 2 }}>Dedicated Detail Pages</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Premium verified apps get their own detailed pages with comprehensive information, screenshots, and user reviews.
              </Typography>
              <List disablePadding sx={{ mb: 2 }}>
                {[<FileText />, <CheckCircle />, <Star />].map((icon, i) => (
                  <ListItem key={i} sx={{ alignItems: 'flex-start', py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                      {React.cloneElement(icon, { size: 20, color: theme.palette.success.main })}
                    </ListItemIcon>
                    <ListItemText
                      primary={[
                        'Full Showcase Page: Complete app presentation',
                        'User Reviews: Build social proof and trust',
                        'SEO Optimized: Better search visibility',
                      ][i]}
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box textAlign="center">
                <Button variant="outlined" size="large"  sx={{
    ...commonStyles.glassButton(theme),
    color: theme.palette.common.white, // ✅ ensure white text (if not already set)
  }} href="/launch/example">
                  See Example Page
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <SectionTitle
          title="Submission Requirements"
          subtitle="What you need to submit apps or blog posts to our platform."
        />
        <Grid container spacing={4} sx={{ mb: 12 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 4, ...glass, boxShadow: shadow }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                App Submission
              </Typography>
              <CardList items={reqApp} />
              <Box textAlign="center" mt={3}>
                <Button variant="contained" size="large" sx={commonStyles.gradientButton(theme)} href="/launch/submit">
                  Submit Your App
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 4, ...glass, boxShadow: shadow }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Blog Submission
              </Typography>
              <CardList items={reqBlog} />
              <Box textAlign="center" mt={3}>
                <Button variant="outlined" size="large"  sx={{
    ...commonStyles.glassButton(theme),
    color: theme.palette.common.white, // ✅ ensure white text (if not already set)
  }} href="/launch/blog-submit">
                  Submit an Article
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box textAlign="center">
          <SectionTitle
            title="Ready to Get Started?"
            subtitle="Join thousands of developers and innovators who have successfully showcased their work."
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" size="large" sx={commonStyles.gradientButton(theme)} href="/launch/submit">
              Submit Your App
            </Button>
            <Button variant="outlined" size="large"  sx={{
    ...commonStyles.glassButton(theme),
    color: theme.palette.common.white, // ✅ ensure white text (if not already set)
  }} href="/launch/blog-submit">
              Submit a Blog Post
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
  