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
import { generateVerificationBadgeHtml } from '@/components/badges/VerificationBadge';

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
          🚀 Enhanced Intelligent Verification System
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          We've upgraded to a comprehensive scoring system with anti-tracking measures and enhanced security
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>95+</Typography>
              <Typography variant="body2">Auto-Verified</Typography>
              <Typography variant="caption">Excellent quality</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>80-94</Typography>
              <Typography variant="body2">Auto-Verified</Typography>
              <Typography variant="caption">Good quality</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>65-79</Typography>
              <Typography variant="body2">Admin Review</Typography>
              <Typography variant="caption">Human verification</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>&lt;65</Typography>
              <Typography variant="body2">Needs Review</Typography>
              <Typography variant="caption">Requires fixes</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* New Features Highlight */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom align="center">
          🆕 New Features & Enhancements
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Security sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Enhanced Security</Typography>
              <Typography variant="body2">Domain validation, HTTPS requirement, spam protection</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">SEO Optimization</Typography>
              <Typography variant="body2">Dofollow links, structured data, better search visibility</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Anti-Tracking</Typography>
              <Typography variant="body2">Multiple badge variations to avoid crawler detection</Typography>
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
                      <strong>Link to BasicUtils (35 points)</strong>
                    </Typography>
                    <Chip label="Required" color="error" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={35} 
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
                      <strong>Verification Text/Badge (25 points)</strong>
                    </Typography>
                    <Chip label="Required" color="error" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={25} 
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

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>SEO Attributes (5 points)</strong>
                    </Typography>
                    <Chip label="Bonus" color="info" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={5} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Bonus for title, alt, or aria-label attributes on the link
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Anti-Tracking Variations (10 points)</strong>
                    </Typography>
                    <Chip label="Anti-Detection" color="warning" size="small" />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={10} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Bonus for using different badge variations and custom styling
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
          {/* Security Requirements */}
          <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              🔒 Security Requirements
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3 }}>
              To prevent spam and ensure quality verification, we have strict security requirements:
            </Typography>
            
            <List dense sx={{ color: 'white' }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Same Domain Only"
                  secondary="Verification URL must be on your website's domain"
                />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="HTTPS Required"
                  secondary="All verification URLs must use secure HTTPS protocol"
                />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="No URL Shorteners"
                  secondary="Blocks bit.ly, tinyurl.com, and other redirect services"
                />
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Webpages Only"
                  secondary="Cannot be files, API endpoints, or admin pages"
                />
              </ListItem>
            </List>
          </Paper>

          {/* Anti-Tracking Features */}
          <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              🕵️ Anti-Tracking Features
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3 }}>
              Our system generates multiple badge variations to avoid SEO crawler detection:
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Dynamic Text Variations:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {['Verified by', 'Featured on', 'Available on', 'Discover on', 'Explore on'].map((text) => (
                  <Chip 
                    key={text} 
                    label={`${text} BasicUtils`} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontSize: '0.7rem'
                    }} 
                  />
                ))}
              </Box>
            </Box>
            
            <Typography variant="body2">
              💡 Each verification generates a random badge variation to prevent pattern recognition while maintaining verification effectiveness.
            </Typography>
          </Paper>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              🎨 Anti-Tracking Badge Variations
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose from multiple badge styles with dynamic text variations to avoid SEO crawler detection:
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Default Style (Random Text)
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ 
                    __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'example-app-id', 'default', 'light')
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Full-featured badge with random text variation
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Compact Style (Random Text)
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ 
                    __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'example-app-id', 'compact', 'light')
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Smaller badge with random text variation
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Minimal Style (Random Text)
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ 
                    __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'example-app-id', 'minimal', 'light')
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Smallest badge with random text variation
                </Typography>
              </Box>
            </Stack>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>💡 Anti-Tracking Benefits:</strong> Each badge uses different text, CSS classes, and styling to prevent SEO crawlers from detecting patterns while maintaining verification effectiveness.
              </Typography>
            </Alert>
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
