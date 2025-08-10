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
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles } from "../../../../../../utils/themeUtils";
import StepMetadata from "../../../submission/blog/StepMetadata";
import StepEditor from "../../../submission/blog/StepEditor";
import StepReview from "../../../submission/blog/StepReview";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const steps = ["Blog Info", "Write Blog", "Review & Submit"];

export default function BlogEditPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch existing blog data
  useEffect(() => {
    async function fetchBlog() {
      if (!params.id) return;
      
      setFetching(true);
      setError(null);
      try {
        const res = await fetch(`/api/user-blogs/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        const blog = data.blog;
        
        // Populate form with existing data
        setFormData({
          title: blog.title || "",
          author: blog.author || blog.authorName || "",
          role: blog.role || "Author",
          tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
          authorBio: blog.authorBio || "Passionate developer and writer sharing insights about modern web development.",
          content: blog.content || "",
          isFounderStory: blog.isInternal || blog.isFounderStory || false,
          founderUrl: blog.founderUrl || "",
          founderDomainCheck: { status: "unknown", message: "" },
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch blog");
      } finally {
        setFetching(false);
      }
    }
    fetchBlog();
  }, [params.id]);

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
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isInternal: formData.isFounderStory,
        // Additional metadata fields
        author: formData.author,
        role: formData.role,
        authorBio: formData.authorBio,
        founderUrl: formData.founderUrl,
        isFounderStory: formData.isFounderStory,
      };
      
      const res = await fetch(`/api/user-blogs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Could not update blog");
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/blogs");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !fetching) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => router.push("/dashboard/blogs")}>
          Back to Blogs
        </Button>
      </Container>
    );
  }

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Edit Your Blog
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Blog updated successfully! Redirecting to blogs page...
          </Alert>
        )}
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
            {loading ? "Updating..." : activeStep === steps.length - 1 ? "Update Blog" : "Next"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 