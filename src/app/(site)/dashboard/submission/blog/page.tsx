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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles } from "../../../../../utils/themeUtils";
import StepMetadata from "./StepMetadata";
import StepEditor from "./StepEditor";
import StepReview from "./StepReview";
import { useState } from "react";
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
    try {
      // Optionally get user info from authClient (if needed on client)
      // const user = await authClient.getSession();
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isInternal: true, // or set based on your logic/UI
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
            <StepReview metadata={formData} content={formData.content} />
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
            disabled={loading}
          >
            {loading ? "Submitting..." : activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
