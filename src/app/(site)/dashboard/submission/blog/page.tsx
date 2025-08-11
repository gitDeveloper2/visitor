"use client";

import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles } from "../../../../../utils/themeUtils";
import StepMetadata from "./StepMetadata";
import StepEditor from "./StepEditor";
import StepReview from "./StepReview";
import { useState } from "react";
import PremiumBlogSubscription from "../../../../../components/premium/PremiumBlogSubscription";
import { authClient } from '../../../auth-client';

const steps = ["Blog Info", "Write Blog", "Review & Submit"];

export default function BlogSubmitPage() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    title: "",
    author: "",
    role: "",
    tags: "",
    authorBio: "",
    content: "",
    isFounderStory: false,
    founderUrl: "",
    founderDomainCheck: { status: "unknown", message: "" } as {
      status: "unknown" | "checking" | "ok" | "taken" | "invalid";
      message?: string;
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Frontend validation: Block non-Founder Story submissions without premium
    if (!formData.isFounderStory) {
      setError('Premium subscription required for non-Founder Story blogs. Please check the "Founder Story" option or subscribe to premium.');
      setLoading(false);
      return;
    }
    
    try {
      // Optionally get user info from authClient (if needed on client)
      // const user = await authClient.getSession();
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isInternal: formData.isFounderStory || false,
        // Additional metadata fields
        author: formData.author,
        role: formData.role,
        authorBio: formData.authorBio,
        founderUrl: formData.founderUrl,
        isFounderStory: formData.isFounderStory,
      };
      const res = await fetch("/api/user-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Could not save blog");
      }
      setSuccess(true);
      setActiveStep(0);
      setFormData({
        title: "",
        author: "",
        role: "",
        tags: "",
        authorBio: "",
        content: "",
        isFounderStory: false,
        founderUrl: "",
        founderDomainCheck: { status: "unknown", message: "" },
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Submit Your Blog
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        {success && <Typography color="success.main" align="center">Blog submitted successfully!</Typography>}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            ...getGlassStyles(theme),
            boxShadow: getShadow(theme, "elegant"),
            minHeight: 500,
          }}
        >
          {activeStep === 0 && (
            <StepMetadata formData={formData} setFormData={handleFormDataChange} />
          )}
          {activeStep === 1 && (
            <StepEditor formData={formData} setFormData={handleFormDataChange} />
          )}
          {activeStep === 2 && (
            <>
              <StepReview metadata={formData} content={formData.content} />
              {!formData.isFounderStory && (
                <Box mt={4}>
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      ⚠️ Premium Blog Access Required
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Publishing non-Founder Story submissions requires an active Premium Blog subscription.
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      To submit this blog, either:
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                      <li>Check "This submission is a Founder Story" in step 1, OR</li>
                      <li>Subscribe to Premium Blog Access below</li>
                    </Box>
                  </Alert>
                  
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setActiveStep(0)}
                      sx={{ mr: 2 }}
                    >
                      ← Go Back to Step 1 (Change Founder Story Setting)
                    </Button>
                  </Box>
                  
                  <PremiumBlogSubscription />
                </Box>
              )}
              {formData.isFounderStory && (
                <Box mt={4}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      ✅ Founder Story detected! This submission will be free and doesn't require premium access.
                    </Typography>
                  </Alert>
                </Box>
              )}
            </>
          )}
        </Paper>
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={loading || (activeStep === steps.length - 1 && !formData.isFounderStory)}
            sx={{
              backgroundColor: activeStep === steps.length - 1 && !formData.isFounderStory ? 'grey.400' : undefined
            }}
          >
            {loading ? "Submitting..." : 
             activeStep === steps.length - 1 ? 
               (formData.isFounderStory ? "Submit Blog" : "Founder Story Required") : 
               "Next"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
