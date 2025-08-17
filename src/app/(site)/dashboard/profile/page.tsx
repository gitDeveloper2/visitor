"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useAuthState } from '@/hooks/useAuth';
import { getShadow, getGlassStyles } from '@/utils/themeUtils';

export default function ProfilePage() {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    bio: '',
    jobTitle: '',
    websiteUrl: '',
    twitterUsername: '',
    linkedinUsername: '',
  });

  // Load current profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setForm({
              bio: data.profile.bio || '',
              jobTitle: data.profile.jobTitle || '',
              websiteUrl: data.profile.websiteUrl || '',
              twitterUsername: data.profile.twitterUsername || '',
              linkedinUsername: data.profile.linkedinUsername || '',
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, ...getGlassStyles(), ...getShadow() }}>
        <Typography variant="h4" gutterBottom align="center">
          Profile Settings
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Update your profile information. This will be used to auto-fill forms when submitting apps and blogs.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Tell us about yourself..."
                helperText="This will appear with your content submissions"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Job Title"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., Software Engineer, Designer, Founder"
                helperText="Your professional role or title"
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
} 