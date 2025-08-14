"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Info,
  Warning,
  Code,
  Link as LinkIcon,
  Security,
  ExpandMore,
  TrendingUp,
  Schedule,
  Assignment,
  Error,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { generateVerificationBadgeHtml } from '@/app/components/badges/VerificationBadge';

export default function VerificationGuidePage() {
  const theme = useTheme();
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('panel1');

  const exampleAppName = "My Awesome App";
  const exampleAppUrl = "https://basicutils.com/launch/my-awesome-app";

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        App Verification Guide
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body1">
          <strong>Why Verification?</strong> To ensure quality and authenticity, we require free app submissions 
          to include a verification badge on their website. This helps us verify that you are the legitimate 
          author of the app and provides valuable backlinks to our platform.
        </Typography>
      </Alert>

      {/* New Scoring System Overview */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom align="center">
          🎯 New Intelligent Verification System
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          We've upgraded to a smart scoring system that provides detailed feedback and faster verification
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>90+</Typography>
              <Typography variant="body2">Auto-Verified</Typography>
              <Typography variant="caption">Instant approval</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>70-89</Typography>
              <Typography variant="body2">Auto-Verified</Typography>
              <Typography variant="caption">With minor warnings</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>50-69</Typography>
              <Typography variant="body2">Admin Review</Typography>
              <Typography variant="caption">Human verification</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>&lt;50</Typography>
              <Typography variant="body2">Failed</Typography>
              <Typography variant="caption">Needs fixes</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              How to Verify Your Free App
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Submit your free app"
                  secondary="After submitting your app, you'll see a verification status in your dashboard."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LinkIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Add the verification badge to your website"
                  secondary="Copy the provided HTML code and add it to your website's homepage or about page."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Security color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Submit the page URL"
                  secondary="Provide the URL where you've added the verification badge."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Smart verification process"
                  secondary="Our system will automatically check your website with intelligent scoring and provide detailed feedback."
                />
              </ListItem>
            </List>
          </Paper>

          {/* Scoring System Details */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              📊 Verification Scoring Breakdown
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Link to BasicUtils (40 points)</strong>
                    </Typography>
                    <Chip label="Required" color="error" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={40} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Your website must link to your app page on BasicUtils
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Verification Text/Badge (30 points)</strong>
                    </Typography>
                    <Chip label="Required" color="error" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={30} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Must include verification text like "Verified on BasicUtils" or similar
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Dofollow Link (20 points)</strong>
                    </Typography>
                    <Chip label="SEO Bonus" color="success" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={20} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Link should not have rel="nofollow" for better SEO value
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Accessibility (10 points)</strong>
                    </Typography>
                    <Chip label="Quality Bonus" color="success" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={10} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Badge should be visible and accessible to users
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              🎯 What Happens After Submission?
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Schedule color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Immediate Check (Attempt 1)</Typography>
                  <Typography variant="caption">Static HTML verification with basic scoring</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Enhanced Check (Attempt 2)</Typography>
                  <Typography variant="caption">Rendered content verification for SPAs and dynamic sites</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="bold">Admin Review (Attempt 3+)</Typography>
                  <Typography variant="caption">Human verification for edge cases and complex situations</Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Common Issues and Solutions */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              🔧 Common Issues & Solutions
            </Typography>
            
            <Accordion expanded={expandedAccordion === 'panel1'} onChange={handleAccordionChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Low Link Score (0-39 points)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>Problem:</strong> Your website doesn't link to your BasicUtils app page.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Solution:</strong> Add a link to your app page. The link should point to: <code>{exampleAppUrl}</code>
                </Typography>
                <Typography variant="body2">
                  <strong>Example:</strong> Add this to your website: "Check out my app on <a href={exampleAppUrl}>BasicUtils</a>"
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion expanded={expandedAccordion === 'panel2'} onChange={handleAccordionChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Low Text Score (0-29 points)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>Problem:</strong> Missing verification text or badge on your website.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Solution:</strong> Use the verification badge HTML code provided in your dashboard.
                </Typography>
                <Typography variant="body2">
                  <strong>Tip:</strong> The badge should be visible on your homepage, about page, or app showcase section.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion expanded={expandedAccordion === 'panel3'} onChange={handleAccordionChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Nofollow Link Issue (0-19 points)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>Problem:</strong> Your link has rel="nofollow" which reduces SEO value.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Solution:</strong> Remove rel="nofollow" from your verification link.
                </Typography>
                <Typography variant="body2">
                  <strong>Note:</strong> This is a bonus score - your app can still be verified without it.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Verification Badge Examples
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose from three different badge styles to match your website's design:
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Default Style
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ 
                    __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'default', 'light')
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Compact Style
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ 
                    __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'compact', 'light')
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Minimal Style
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ 
                    __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'minimal', 'light')
                  }}
                />
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              ⚡ Verification Timeline
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  Immediate (0-5 minutes)
                </Typography>
                <Typography variant="caption">
                  Initial verification attempt with static HTML parsing
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" fontWeight="bold" color="warning.main">
                  Enhanced (5-15 minutes)
                </Typography>
                <Typography variant="caption">
                  Second attempt with rendered content for SPAs
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" fontWeight="bold" color="info.main">
                  Admin Review (24 hours)
                </Typography>
                <Typography variant="caption">
                  Human verification for complex cases
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Alert severity="success">
            <Typography variant="body2">
              <strong>Pro Tip:</strong> Place your verification badge prominently on your homepage or about page for the best results. 
              The more visible it is, the higher your accessibility score will be!
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
}
