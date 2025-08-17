"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuth';
import { useTheme } from '@mui/material/styles';
import { getShadow, getGlassStyles } from '@/utils/themeUtils';
import { User, Briefcase, Globe, Twitter, Linkedin, CheckCircle } from 'lucide-react';

const steps = [
  { label: 'Welcome', icon: <User size={20} /> },
  { label: 'Professional Info', icon: <Briefcase size={20} /> },
  { label: 'Social Links', icon: <Globe size={20} /> },
  { label: 'Complete', icon: <CheckCircle size={20} /> }
];

export default function OnboardingPage() {
  const router = useRouter();
  const theme = useTheme();
  const { user, isLoading } = useAuthState();
  const [activeStep, setActiveStep] = useState(0);
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

  const handleNext = () => {
    if (activeStep === 0) {
      // Welcome step - just move to next
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 1) {
      // Validate professional info
      if (!form.bio || !form.jobTitle) {
        setError('Please fill in your bio and job title');
        return;
      }
      setActiveStep((prevStep) => prevStep + 1);
      setError(null);
    } else if (activeStep === 2) {
      // Social links step - optional, can skip
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to BasicUtils! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Let's set up your profile so you can start submitting apps and blogs with consistent author information.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This will only take a few minutes and will make your content submissions much faster in the future.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Tell Us About Yourself
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This information will appear with your content submissions and help establish your credibility.
            </Typography>
            <TextField
              label="Bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Tell us about yourself, your expertise, and what you do..."
              helperText="A short professional bio that will appear with your content"
              sx={{ mb: 3 }}
            />
            <TextField
              label="Job Title"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., Software Engineer, Designer, Founder, Student"
              helperText="Your professional role or title"
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Social & Professional Links
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              These are optional but help establish your professional presence.
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
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              You're All Set! 🚀
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Your profile is complete. Now when you submit apps and blogs, the forms will automatically fill with your information!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can always update your profile later from the dashboard.
            </Typography>
          </Box>
        );
      default:
        return null;
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
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          Complete Your Profile
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleComplete}
                disabled={loading}
                size="large"
                sx={{ px: 4 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Complete Setup'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                size="large"
              >
                {activeStep === steps.length - 2 ? 'Skip' : 'Next'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 