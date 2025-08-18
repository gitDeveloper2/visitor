"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close, CheckCircle } from '@mui/icons-material';
import { useCookieConsent } from '../context/CookieConsentContext';
import { ConsentPreferences } from '../hooks/useConsent';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const { preferences, saveConsent } = useCookieConsent();
  const [localConsent, setLocalConsent] = useState<ConsentPreferences>(preferences);

  // Sync local consent with context preferences
  useEffect(() => {
    setLocalConsent(preferences);
  }, [preferences]);

  const handleSavePreferences = () => {
    saveConsent(localConsent);
    onClose();
  };

  const handleCancel = () => {
    setLocalConsent(preferences); // Reset to original preferences
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Paper
      elevation={24}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        borderRadius: 0,
        background: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${theme.palette.divider}`,
        p: { xs: 2, sm: 3 },
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Cookie Preferences
          </Typography>
          <Button
            onClick={handleCancel}
            sx={{ minWidth: 'auto', p: 0.5 }}
          >
            <Close />
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Essential Cookies
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            These cookies are necessary for the website to function properly. They cannot be disabled.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle sx={{ color: 'success.main' }} />
            <Typography variant="body2">Always enabled</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Analytics Cookies
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Help us understand how visitors interact with our website by collecting and reporting information anonymously.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="checkbox"
              checked={localConsent.analytics}
              onChange={(e) => setLocalConsent(prev => ({ ...prev, analytics: e.target.checked }))}
              style={{ transform: 'scale(1.2)' }}
            />
            <Typography variant="body2">Enable analytics cookies</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Marketing Cookies
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Used to deliver personalized advertisements and track advertising campaign performance.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="checkbox"
              checked={localConsent.marketing}
              onChange={(e) => setLocalConsent(prev => ({ ...prev, marketing: e.target.checked }))}
              style={{ transform: 'scale(1.2)' }}
            />
            <Typography variant="body2">Enable marketing cookies</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Preference Cookies
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Allow the website to remember choices you make and provide enhanced, more personal features.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="checkbox"
              checked={localConsent.preferences}
              onChange={(e) => setLocalConsent(prev => ({ ...prev, preferences: e.target.checked }))}
              style={{ transform: 'scale(1.2)' }}
            />
            <Typography variant="body2">Enable preference cookies</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ minWidth: 140 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePreferences}
            sx={{ minWidth: 140 }}
          >
            Save Preferences
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CookiePreferencesModal; 