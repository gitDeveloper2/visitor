"use client";

import React, { Suspense, useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Paper,
  Divider,
  InputAdornment,
  Stack,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { Delete as DeleteIcon, KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon, Check } from "@mui/icons-material";
import { Star, BadgeCheck, DollarSign, UploadCloud, Github, Globe, User, Code, Plus } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { getSubcategorySuggestions, fetchCategoryNames } from "@/utils/categories";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "@/utils/themeUtils";
import { useAuthState } from "@/hooks/useAuth";
import { adRegistry } from "@/app/components/adds/google/AdRegistry";

function SubmitAppPageContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { user } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newTech, setNewTech] = useState("");
  const [selectedPremiumPlan, setSelectedPremiumPlan] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const hasLoadedDataRef = useRef(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    fullDescription: "",
    subcategories: [] as string[],
    website: "",
    github: "",
    category: "",
    techStack: [] as string[],
    pricing: "Free",
    features: [] as string[],
    isInternal: false,
    authorName: "",
    authorEmail: "",
    authorBio: "",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const addFeature = () => {
    if (newFeature.trim() && !form.features.includes(newFeature.trim())) {
      setForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addTech = () => {
    if (newTech.trim() && !form.techStack.includes(newTech.trim())) {
      setForm(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    setForm(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Basic validation
      if (!form.name || !form.description) {
        setError("Please fill in all required fields.");
        return;
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const reviewSteps = ["Initial Review", "Quality Check", "Publication"];
  const pricingOptions = ["Free", "Freemium", "One-time", "Subscription", "Enterprise"];

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography variant="h2" sx={typographyVariants.sectionTitle} textAlign="center">
          {isEditing ? 'Edit Your' : 'Submit Your'} <Box component="span" sx={commonStyles.textGradient}>App</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" mt={2} mb={6}>
          {isEditing 
            ? 'Update your app information and save your changes.'
            : 'Share your innovation with thousands of tech enthusiasts and get the visibility you deserve.'
          }
        </Typography>



        {/* Progress Steps */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {reviewSteps.map((step, index) => (
            <Chip
              key={step}
              label={step}
              variant={index === 0 ? "filled" : "outlined"}
              color={index === 0 ? "primary" : "default"}
              size="small"
              sx={{ px: 2, py: 1 }}
            />
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            App submitted successfully! We'll review it and get back to you soon.
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ ...getGlassStyles(theme), p: 4, borderRadius: "1.5rem", boxShadow: getShadow(theme, "elegant"), position: 'relative' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Basic App Information */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                  <Star size={24} color={theme.palette.primary.main} />
                  Basic App Information
                </Typography>
              </Grid>
            
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="App Name" 
                  required 
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  helperText="Choose a memorable and descriptive name"
                  error={Boolean(fieldErrors.name)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={form.category}
                    label="Category"
                    onChange={(e) => handleChange("category", e.target.value)}
                  >
                    <MenuItem value="Productivity">Productivity</MenuItem>
                    <MenuItem value="Development">Development</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Tagline"
                  fullWidth
                  required
                  placeholder="A brief, compelling description of your app"
                  value={form.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  helperText="A short, catchy description that appears in listings"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  required
                  fullWidth
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  helperText="A concise description for listings and previews"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Full Description"
                  multiline
                  rows={6}
                  fullWidth
                  placeholder="Tell the full story of your app"
                  value={form.fullDescription}
                  onChange={(e) => handleChange("fullDescription", e.target.value)}
                  required
                  helperText="Detailed description for the app page"
                />
              </Grid>

              {/* Links */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                  <Globe size={24} color={theme.palette.primary.main} />
                  Links & URLs
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Website URL" 
                  placeholder="https://yourapp.com" 
                  required
                  value={form.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Globe size={20} />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Your app's main website or landing page"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="GitHub Repository" 
                  placeholder="https://github.com/username/repo"
                  value={form.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Github size={20} />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Optional: Link to your open-source code"
                />
              </Grid>

              {/* Tech Stack */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                  <Code size={24} color={theme.palette.primary.main} />
                  Technical Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                  Tech Stack
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Add technology"
                    fullWidth
                    placeholder="e.g. React, Node.js, MongoDB, AWS"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    helperText="Press Enter or tap + to add"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Add technology"
                            size="small"
                            onClick={addTech}
                            disabled={!newTech.trim()}
                          >
                            <Plus size={18} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.techStack.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      onDelete={() => removeTech(index)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Pricing Model</InputLabel>
                  <Select
                    value={form.pricing}
                    label="Pricing Model"
                    onChange={(e) => handleChange("pricing", e.target.value)}
                  >
                    {pricingOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Features */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                  Key Features
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    label="Add a feature"
                    fullWidth
                    placeholder="e.g. Real-time collaboration, AI-powered suggestions"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    helperText="Press Enter or tap + to add"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Add feature"
                            size="small"
                            onClick={addFeature}
                            disabled={!newFeature.trim()}
                          >
                            <Plus size={18} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  {form.features.map((feature, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        ✨ {feature}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeFeature(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              </Grid>

              {/* Author Information */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                  <User size={24} color={theme.palette.primary.main} />
                  Author Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Author Name" 
                  required
                  value={form.authorName}
                  onChange={(e) => handleChange("authorName", e.target.value)}
                  helperText="Your name or company name"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Author Email" 
                  type="email"
                  required
                  value={form.authorEmail}
                  onChange={(e) => handleChange("authorEmail", e.target.value)}
                  helperText="We'll use this to contact you about your submission"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Author Bio"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Tell us about yourself and what inspired you to create this app"
                  value={form.authorBio}
                  onChange={(e) => handleChange("authorBio", e.target.value)}
                  helperText="A brief bio that will be displayed on your app page"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box mt={4} textAlign="center">
                  <Button 
                    type="submit"
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    sx={{ borderRadius: "999px", px: 6, py: 1.5 }}
                    startIcon={<Star size={20} />}
                    disabled={loading || !form.name || !form.description}
                  >
                    {loading ? 'Submitting...' : 'Submit App for Review'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
        

        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            component={Link}
            href="/pricing"
            variant="outlined"
            size="medium"
            startIcon={<Star size={20} />}
            sx={{ borderRadius: 2 }}
          >
            View Premium Plans
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default function SubmitAppPage() {
  return (
    <Suspense fallback={<div />}>
      <SubmitAppPageContent />
    </Suspense>
  );
} 