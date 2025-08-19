"use client";

import React from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useCookieConsent } from '@/context/CookieConsentContext';

const TestCookieConsentPage = () => {
  const { hasConsent, hasConsented, preferences, resetConsent } = useCookieConsent();

  const handleResetConsent = () => {
    resetConsent();
    // Reload the page to show the consent banner again
    window.location.reload();
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Cookie Consent Test Page
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current Consent Status
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Has Consented: <strong>{hasConsented ? 'Yes' : 'No'}</strong>
        </Typography>
        
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Essential Cookies" 
              secondary={`Status: ${preferences.necessary ? 'Enabled' : 'Disabled'} (Always enabled)`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Analytics Cookies" 
              secondary={`Status: ${preferences.analytics ? 'Enabled' : 'Disabled'}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Marketing Cookies" 
              secondary={`Status: ${preferences.marketing ? 'Enabled' : 'Disabled'}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Preference Cookies" 
              secondary={`Status: ${preferences.preferences ? 'Enabled' : 'Disabled'}`}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Consent Checks
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Analytics Consent" 
              secondary={`Has consent: ${hasConsent('analytics') ? 'Yes' : 'No'}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Marketing Consent" 
              secondary={`Has consent: ${hasConsent('marketing') ? 'Yes' : 'No'}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Preferences Consent" 
              secondary={`Has consent: ${hasConsent('preferences') ? 'Yes' : 'No'}`}
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Testing Instructions
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          1. <strong>First Visit:</strong> You should see the cookie consent banner at the bottom of the page
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          2. <strong>Accept All:</strong> Click "Accept All" to grant all permissions
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          3. <strong>Customize:</strong> Click "Customize" to set individual preferences
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          4. <strong>Footer Link:</strong> Use the "Privacy & Cookies" link in the footer to reopen preferences
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          5. <strong>Reset:</strong> Use the button below to reset consent and test again
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Google Consent Mode Verification
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Open your browser's Developer Tools and check:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Console" 
              secondary="Look for gtag consent calls and any errors"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Network Tab" 
              secondary="Check for Google Analytics and AdSense requests with consent parameters"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Application Tab" 
              secondary="Verify localStorage has cookie-consent and user-location entries"
            />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleResetConsent}
          sx={{ mr: 2 }}
        >
          Reset Consent & Reload
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>

      <Paper sx={{ p: 3, mt: 3, backgroundColor: 'warning.light' }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'warning.dark' }}>
          ⚠️ Important Notes
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • This page is for testing purposes only
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • The consent banner only shows to users in EEA, UK, and Switzerland
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Google scripts only load after user consent
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Consent preferences are stored in localStorage
        </Typography>
        <Typography variant="body2">
          • Use browser dev tools to verify Google Consent Mode integration
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestCookieConsentPage; 