"use client";

import React from "react";
import { Box, Stepper, Step, StepLabel, Button, Typography, Container, Paper, Alert, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getShadow, getGlassStyles } from "../../../../../../utils/themeUtils";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StepReview from "../../../submit/blog/StepReview";
import StepEditor from "../../../submit/blog/StepEditor";
import StepMetadata, { type BlogMetadata } from "../../../submit/blog/StepMetadata";

const steps = ["Blog Info", "Write Blog", "Review & Submit"];

export default function BlogEditPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState<BlogMetadata>({
    title: "",
    author: "",
    role: "Author",
    category: "",
    tags: [],
    authorBio: "Passionate developer and writer sharing insights about modern web development.",
    content: "",
    isFounderStory: false,
    founderUrl: "",
    founderDomainCheck: { status: "unknown" as const, message: "" },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      if (!params.id) return;
      setFetching(true);
      setError(null);
      try {
        const res = await fetch(`/api/user-blogs/admin/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        const blog = data.blog;
        setFormData({
          title: blog.title || "",
          author: blog.author || blog.authorName || "",
          role: blog.role || "Author",
          category: blog.category || "",
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          authorBio: blog.authorBio || "Passionate developer and writer sharing insights about modern web development.",
          content: blog.content || "",
          isFounderStory: blog.isInternal || blog.isFounderStory || false,
          founderUrl: blog.founderUrl || "",
          founderDomainCheck: { status: "unknown" as const, message: "" },
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch blog");
      } finally {
        setFetching(false);
      }
    }
    fetchBlog();
  }, [params.id]);

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleFormDataChange = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        isInternal: formData.isFounderStory,
        // Additional metadata fields
        author: formData.author,
        role: formData.role,
        category: formData.category,
        authorBio: formData.authorBio,
        founderUrl: formData.founderUrl,
        isFounderStory: formData.isFounderStory,
      };
      const res = await fetch(`/api/user-blogs/admin/${params.id}`, {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading blog...</Typography>
      </Box>
    );
  }

  if (error && !fetching) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          component={Link}
          href="/dashboard/blogs"
          variant="contained"
        >
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