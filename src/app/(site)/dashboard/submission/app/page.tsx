"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BadgeCheck, DollarSign, UploadCloud } from "lucide-react";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "../../../../../utils/themeUtils";
import { useState } from "react";

export default function SubmitAppPage() {
  const theme = useTheme();
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    tags: "",
    website: "",
    github: "",
    category: "",
    techStack: "",
    pricing: "Free",
    features: "",
    isInternal: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        website: form.website,
        github: form.github,
        category: form.category || 'Other',
        techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
        pricing: form.pricing,
        features: form.features.split(',').map((t) => t.trim()).filter(Boolean),
        isInternal: form.isInternal,
      };
      const res = await fetch("/api/user-apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Could not save app");
      }
      setSuccess(true);
      setForm({ 
        name: "", 
        description: "", 
        tags: "",
        website: "",
        github: "",
        category: "",
        techStack: "",
        pricing: "Free",
        features: "",
        isInternal: false
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const reviewSteps = ["Initial Review", "Quality Check", "Publication"];

  const categories = [
    "Productivity", "Development", "Design", "Marketing", 
    "Analytics", "Communication", "Finance", "Education", "Entertainment", "Other"
  ];

  const pricingOptions = ["Free", "Freemium", "Paid", "Enterprise", "Contact Sales"];

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="md">
        {/* Page Title */}
        <Typography variant="h2" sx={typographyVariants.sectionTitle} textAlign="center">
          Submit Your <Box component="span" sx={commonStyles.textGradient}>App</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" mt={2} mb={6}>
          Share your innovation with thousands of tech enthusiasts and get the visibility you deserve.
        </Typography>

        {/* Form */}
        <Paper sx={{ ...getGlassStyles(theme), p: 4, borderRadius: "1.5rem", boxShadow: getShadow(theme, "elegant") }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="App Name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  helperText="Choose a clear, memorable name for your app"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Description" 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  required 
                  multiline 
                  rows={4} 
                  helperText="Minimum 100 characters. Be detailed about your app's features and benefits." 
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  helperText="Select the most appropriate category"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Pricing Model"
                  name="pricing"
                  value={form.pricing}
                  onChange={handleChange}
                  helperText="How users can access your app"
                >
                  {pricingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Website URL" 
                  name="website" 
                  value={form.website} 
                  onChange={handleChange} 
                  placeholder="https://yourapp.com"
                  helperText="Where users can learn more about your app"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="GitHub Repository" 
                  name="github" 
                  value={form.github} 
                  onChange={handleChange} 
                  placeholder="https://github.com/username/repo"
                  helperText="Optional: Link to your source code"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField 
                  label="Tags" 
                  name="tags" 
                  value={form.tags} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  placeholder="e.g. React, Mobile, Productivity" 
                  helperText="Add 3-5 relevant tags separated by commas" 
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField 
                  label="Tech Stack" 
                  name="techStack" 
                  value={form.techStack} 
                  onChange={handleChange} 
                  fullWidth 
                  placeholder="e.g. React, Node.js, MongoDB" 
                  helperText="Technologies and frameworks used in your app" 
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField 
                  label="Key Features" 
                  name="features" 
                  value={form.features} 
                  onChange={handleChange} 
                  fullWidth 
                  multiline 
                  rows={3}
                  placeholder="e.g. Real-time collaboration, AI-powered insights, Mobile responsive" 
                  helperText="List the main features that make your app unique" 
                />
              </Grid>
            </Grid>
            
            {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
            {success && <Typography color="success.main" align="center" sx={{ mt: 2 }}>App submitted successfully!</Typography>}
            
            <Box mt={6} textAlign="center">
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ borderRadius: "999px", px: 4 }} disabled={loading}>
                {loading ? "Submitting..." : "Submit App for Review"}
              </Button>
            </Box>
          </form>

          {/* Premium Section */}
          <Box
            sx={{
              mt: 5,
              p: 3,
              borderRadius: "1rem",
              ...getGlassStyles(theme),
              border: `1px solid ${theme.palette.warning.main}`,
              boxShadow: getShadow(theme, "elegant"),
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <DollarSign size={20} color={theme.palette.warning.main} />
              <Typography variant="h6" fontWeight={700}>
                Upgrade to Premium – <Box component="span" color="warning.main">$19</Box>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Get a verified badge, priority placement, and analytics insights for your app.
            </Typography>
            <Button
              sx={{ mt: 2, borderRadius: "999px" }}
              variant="outlined"
              color="warning"
              startIcon={<BadgeCheck />}
            >
              Upgrade to Premium
            </Button>
          </Box>

          {/* Review Process */}
          <Box mt={6}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Review Process
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5}>
              {reviewSteps.map((step) => (
                <Chip
                  key={step}
                  label={step}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: "999px",
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                  }}
                
                />
              ))}
            </Box>
          </Box>

          {/* Submit Button */}
          <Box mt={6} textAlign="center">
            <Button variant="contained" color="primary" size="large" sx={{ borderRadius: "999px", px: 4 }}>
              Submit App for Review
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
