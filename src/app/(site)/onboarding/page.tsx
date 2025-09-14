"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuth';
import { useTheme } from '@mui/material/styles';
import { getShadow, getGlassStyles } from '@/utils/themeUtils';
import { User, Briefcase, Globe, Twitter, Linkedin, CheckCircle } from 'lucide-react';
import { authClient } from '@/app/auth-client';

export default function OnboardingPage() {
  const router = useRouter();
  const theme = useTheme();
  const { user, isLoading } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    bio: '',
    jobTitle: '',
    websiteUrl: '',
    twitterUsername: '',
    linkedinUsername: '',
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!form.bio?.trim() || !form.jobTitle?.trim()) {
      setError('Please fill in your bio and job title');
      setLoading(false);
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      console.log("form ",form)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        console.log("error ",response)
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }
      console.log("succeeded")
      
      // Mark onboarding as complete in the API response
      const updatedProfile = await response.json();
      console.log("Profile updated:", updatedProfile);
      
      // Force session refresh to get updated user data
      await authClient.getSession({ query: { disableCookieCache: true } });
      
      // Small delay to ensure session is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate without full page reload to preserve any potential error states
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err.message || 'Unknown error occurred');
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, ...getGlassStyles(theme), boxShadow: getShadow(theme, 'elegant') }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <User sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            Complete Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set up your profile to start submitting apps and blogs with consistent author information.
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              position: 'sticky',
              top: 16,
              zIndex: 1000,
              boxShadow: 2
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Required Information Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Briefcase sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Professional Information
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This information will appear with your content submissions and help establish your credibility.
            </Typography>
            
            <TextField
              label="Bio *"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Tell us about yourself, your expertise, and what you do..."
              helperText="A short professional bio that will appear with your content"
              sx={{ mb: 3 }}
              required
            />
            
            <TextField
              label="Job Title *"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., Software Engineer, Designer, Founder, Student"
              helperText="Your professional role or title"
              required
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Optional Social Links Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Globe sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Social & Professional Links (Optional)
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              These help establish your professional presence but are completely optional.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Website URL"
                  name="websiteUrl"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  fullWidth
                  placeholder="https://yourwebsite.com"
                  helperText="Your personal or company website"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Twitter Username"
                  name="twitterUsername"
                  value={form.twitterUsername}
                  onChange={handleChange}
                  fullWidth
                  placeholder="@username"
                  helperText="Your Twitter handle (without @)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="LinkedIn Username"
                  name="linkedinUsername"
                  value={form.linkedinUsername}
                  onChange={handleChange}
                  fullWidth
                  placeholder="username"
                  helperText="Your LinkedIn profile username"
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              size="large"
              sx={{ px: 6, py: 1.5 }}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </Box>
        </form>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            You can always update your profile later from the dashboard.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 