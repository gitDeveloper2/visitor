"use client";

import React from 'react';
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
} from '@mui/material';
import {
  CheckCircle,
  Info,
  Warning,
  Code,
  Link as LinkIcon,
  Security,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { generateVerificationBadgeHtml } from '@/app/components/badges/VerificationBadge';

export default function VerificationGuidePage() {
  const theme = useTheme();

  const exampleAppName = "My Awesome App";
  const exampleAppUrl = "https://basicutils.com/launch/my-awesome-app";

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
                  primary="Automatic verification"
                  secondary="Our system will automatically check your website within 24 hours."
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Verification Badge Examples
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              Here are the different styles of verification badges you can use:
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Default Style</Typography>
                    <Box 
                      dangerouslySetInnerHTML={{ 
                        __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'default', 'light') 
                      }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Compact Style</Typography>
                    <Box 
                      dangerouslySetInnerHTML={{ 
                        __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'compact', 'light') 
                      }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Minimal Style</Typography>
                    <Box 
                      dangerouslySetInnerHTML={{ 
                        __html: generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'minimal', 'light') 
                      }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              HTML Code Example
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              Copy and paste this HTML code into your website:
            </Typography>
            
            <Box 
              component="pre" 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1, 
                overflow: 'auto',
                fontSize: '0.875rem',
                fontFamily: 'monospace'
              }}
            >
              {generateVerificationBadgeHtml(exampleAppName, exampleAppUrl, 'default', 'light')}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
              Important Notes
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Dofollow links only"
                  secondary="The verification badge must be a dofollow link (no rel='nofollow')."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Public pages only"
                  secondary="The verification page must be publicly accessible."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="24-hour processing"
                  secondary="Verification checks are performed automatically within 24 hours."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Free apps only"
                  secondary="Verification is only required for free app submissions."
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
              Common Issues
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Page not found"
                  secondary="Make sure the URL you provide is accessible and returns a 200 status code."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Badge not found"
                  secondary="Ensure the verification badge HTML is present on the page."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Nofollow links"
                  secondary="Remove any rel='nofollow' attributes from the verification link."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="JavaScript rendering"
                  secondary="The badge must be present in the initial HTML, not added by JavaScript."
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
              Technical Requirements
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              The verification system checks for:
            </Typography>
            
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Valid link to your app"
                  secondary="The badge must link to your app's page on BasicUtils."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Verification text"
                  secondary="The badge must contain 'BasicUtils' or 'Verified App' text."
                />
              </ListItem>
              
              <ListItem>
                <ListItemText 
                  primary="Dofollow attribute"
                  secondary="The link must not have rel='nofollow'."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
