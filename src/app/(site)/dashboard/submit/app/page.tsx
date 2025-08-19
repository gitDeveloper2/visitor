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
  Card,
  CardContent,
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

// App quality limits (similar to blog limits)
const APP_LIMITS = {
  nameMin: 3,
  nameMax: 100,
  taglineMin: 10,
  taglineMax: 200,
  descriptionMin: 50,
  descriptionMax: 500,
  fullDescriptionMin: 200,
  fullDescriptionMax: 2000,
  authorNameMin: 2,
  authorNameMax: 100,
  authorBioMin: 20,
  authorBioMax: 500,
  featuresMin: 1,
  featuresMax: 10,
  techStackMin: 1,
  techStackMax: 15,
} as const;

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check for payment success on component mount
  React.useEffect(() => {
    const paymentSuccessParam = searchParams.get('payment_success');
    const appId = searchParams.get('app_id');
    
    if (paymentSuccessParam === 'true' && appId) {
      setPaymentSuccess(true);
      setSuccess(true);
      // Clear the URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment_success');
      url.searchParams.delete('app_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

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

  // Prefill author fields from session for new submissions only (do not override edits)
  React.useEffect(() => {
    if (!user) return;
    if (isEditing) return; // editing existing app
    setForm(prev => ({
      ...prev,
      authorName: prev.authorName || (user as any)?.name || "",
      authorEmail: prev.authorEmail || (user as any)?.email || "",
      authorBio: prev.authorBio || (user as any)?.bio || "",
    }));
  }, [user, isEditing]);

  // Validation functions
  const validateAppMetadata = () => {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!form.name?.trim()) {
      errors.name = "App name is required";
    } else if (form.name.trim().length < APP_LIMITS.nameMin) {
      errors.name = `App name must be at least ${APP_LIMITS.nameMin} characters`;
    } else if (form.name.trim().length > APP_LIMITS.nameMax) {
      errors.name = `App name must be under ${APP_LIMITS.nameMax} characters`;
    }
    
    if (!form.tagline?.trim()) {
      errors.tagline = "Tagline is required";
    } else if (form.tagline.trim().length < APP_LIMITS.taglineMin) {
      errors.tagline = `Tagline must be at least ${APP_LIMITS.taglineMin} characters`;
    } else if (form.tagline.trim().length > APP_LIMITS.taglineMax) {
      errors.tagline = `Tagline must be under ${APP_LIMITS.taglineMax} characters`;
    }
    
    if (!form.description?.trim()) {
      errors.description = "Description is required";
    } else if (form.description.trim().length < APP_LIMITS.descriptionMin) {
      errors.description = `Description must be at least ${APP_LIMITS.descriptionMin} characters`;
    } else if (form.description.trim().length > APP_LIMITS.descriptionMax) {
      errors.description = `Description must be under ${APP_LIMITS.descriptionMax} characters`;
    }
    
    if (!form.fullDescription?.trim()) {
      errors.fullDescription = "Full description is required";
    } else if (form.fullDescription.trim().length < APP_LIMITS.fullDescriptionMin) {
      errors.fullDescription = `Full description must be at least ${APP_LIMITS.fullDescriptionMin} characters`;
    } else if (form.fullDescription.trim().length > APP_LIMITS.fullDescriptionMax) {
      errors.fullDescription = `Full description must be under ${APP_LIMITS.fullDescriptionMax} characters`;
    }
    
    if (!form.category?.trim()) {
      errors.category = "Category is required";
    }
    
    if (!form.website?.trim()) {
      errors.website = "Website URL is required";
    } else if (!isValidUrl(form.website)) {
      errors.website = "Please enter a valid website URL";
    }
    
    if (!form.authorName?.trim()) {
      errors.authorName = "Author name is required";
    } else if (form.authorName.trim().length < APP_LIMITS.authorNameMin) {
      errors.authorName = `Author name must be at least ${APP_LIMITS.authorNameMin} characters`;
    } else if (form.authorName.trim().length > APP_LIMITS.authorNameMax) {
      errors.authorName = `Author name must be under ${APP_LIMITS.authorNameMax} characters`;
    }
    
    if (!form.authorEmail?.trim()) {
      errors.authorEmail = "Author email is required";
    } else if (!isValidEmail(form.authorEmail)) {
      errors.authorEmail = "Please enter a valid email address";
    }
    
    if (!form.authorBio?.trim()) {
      errors.authorBio = "Author bio is required";
    } else if (form.authorBio.trim().length < APP_LIMITS.authorBioMin) {
      errors.authorBio = `Author bio must be at least ${APP_LIMITS.authorBioMin} characters`;
    } else if (form.authorBio.trim().length > APP_LIMITS.authorBioMax) {
      errors.authorBio = `Author bio must be under ${APP_LIMITS.authorBioMax} characters`;
    }
    
    // Array validations
    if (!Array.isArray(form.features) || form.features.length < APP_LIMITS.featuresMin) {
      errors.features = `Add at least ${APP_LIMITS.featuresMin} feature`;
    } else if (form.features.length > APP_LIMITS.featuresMax) {
      errors.features = `Keep features under ${APP_LIMITS.featuresMax}`;
    }
    
    if (!Array.isArray(form.techStack) || form.techStack.length < APP_LIMITS.techStackMin) {
      errors.techStack = `Add at least ${APP_LIMITS.techStackMin} technology`;
    } else if (form.techStack.length > APP_LIMITS.techStackMax) {
      errors.techStack = `Keep tech stack under ${APP_LIMITS.techStackMax}`;
    }
    
    // Optional GitHub validation
    if (form.github?.trim() && !isValidUrl(form.github)) {
      errors.github = "Please enter a valid GitHub URL";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear validation errors for this field
    setValidationErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
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
      // Clear validation error for features
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy.features;
        return copy;
      });
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
      // Clear validation error for techStack
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy.techStack;
        return copy;
      });
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
    setSuccess(false);
    
    try {
      // Validate all fields before submission
      if (!validateAppMetadata()) {
        setError("Please fix the highlighted validation errors before submitting.");
        setLoading(false);
        return;
      }
      
      const payload = {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        fullDescription: form.fullDescription,
        subcategories: form.subcategories,
        website: form.website,
        github: form.github,
        category: form.category,
        techStack: form.techStack,
        pricing: form.pricing,
        features: form.features,
        isInternal: form.isInternal,
        authorName: form.authorName,
        authorEmail: form.authorEmail,
        authorBio: form.authorBio,
        premiumPlan: selectedPremiumPlan, // Include premium plan selection
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
      
      const result = await res.json();
      
      // If premium was selected, redirect to checkout
      if (selectedPremiumPlan === 'premium' && result.app?._id) {
        try {
          const checkoutRes = await fetch("/api/lemonsqueezy/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_APP_LISTING_VARIANT_ID,
              custom: {
                subscription_type: "premium_app_listing",
                app_id: result.app._id,
                app_name: form.name,
                return_url: `${window.location.origin}/dashboard/submit/app?payment_success=true&app_id=${result.app._id}`,
              },
            }),
          });

          if (checkoutRes.ok) {
            const { checkoutUrl } = await checkoutRes.json();
            window.location.href = checkoutUrl;
            return;
          } else {
            const errorData = await checkoutRes.json().catch(() => ({}));
            throw new Error(`Failed to create checkout: ${errorData.error || 'Unknown error'}`);
          }
        } catch (checkoutError: any) {
          console.error('Checkout error:', checkoutError);
          setError(`Payment setup failed: ${checkoutError.message}. Your app was saved but premium features are not active.`);
          setSuccess(true);
          return;
        }
      }
      
      setSuccess(true);
      setForm({ 
        name: "", 
        tagline: "",
        description: "", 
        fullDescription: "",
        subcategories: [],
        website: "",
        github: "",
        category: "",
        techStack: [],
        pricing: "Free",
        features: [],
        isInternal: false,
        authorName: "",
        authorEmail: "",
        authorBio: "",
      });
      setSelectedPremiumPlan(null);
      setValidationErrors({});
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const reviewSteps = ["Initial Review", "Quality Check", "Publication"];
  const pricingOptions = ["Free", "Freemium", "One-time", "Subscription", "Enterprise"];

  const premiumFeatures = [
    'Verified badge and premium placement',
    'Priority review process (24-48 hours)',
    'Enhanced app analytics and insights',
    'Featured in premium app showcase',
    'Priority customer support',
    'Marketing promotion opportunities',
    'Lifetime premium status (no expiration)',
  ];

  const handlePremiumSelection = (plan: string | null) => {
    setSelectedPremiumPlan(plan);
  };

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
            {paymentSuccess 
              ? "🎉 Payment successful! Your app has been submitted with premium features activated. We'll review it and get back to you soon."
              : "App submitted successfully! We'll review it and get back to you soon."
            }
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
                  helperText={`Choose a memorable and descriptive name (${form.name.length}/${APP_LIMITS.nameMax})`}
                  error={Boolean(validationErrors.name)}
                  FormHelperTextProps={{
                    sx: { 
                      color: form.name.length > APP_LIMITS.nameMax ? 'error.main' : 'text.secondary',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }
                  }}
                />
                {validationErrors.name && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.name}
                  </FormHelperText>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={Boolean(validationErrors.category)}>
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
                  {validationErrors.category && (
                    <FormHelperText error>
                      {validationErrors.category}
                    </FormHelperText>
                  )}
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
                  helperText={`A short, catchy description that appears in listings (${form.tagline.length}/${APP_LIMITS.taglineMax})`}
                  error={Boolean(validationErrors.tagline)}
                  FormHelperTextProps={{
                    sx: { 
                      color: form.tagline.length > APP_LIMITS.taglineMax ? 'error.main' : 'text.secondary',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }
                  }}
                />
                {validationErrors.tagline && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.tagline}
                  </FormHelperText>
                )}
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
                  helperText={`A concise description for listings and previews (${form.description.length}/${APP_LIMITS.descriptionMax})`}
                  error={Boolean(validationErrors.description)}
                  FormHelperTextProps={{
                    sx: { 
                      color: form.description.length > APP_LIMITS.descriptionMax ? 'error.main' : 'text.secondary',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }
                  }}
                />
                {validationErrors.description && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.description}
                  </FormHelperText>
                )}
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
                  helperText={`Detailed description for the app page (${form.fullDescription.length}/${APP_LIMITS.fullDescriptionMax})`}
                  error={Boolean(validationErrors.fullDescription)}
                  FormHelperTextProps={{
                    sx: { 
                      color: form.fullDescription.length > APP_LIMITS.fullDescriptionMax ? 'error.main' : 'text.secondary',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }
                  }}
                />
                {validationErrors.fullDescription && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.fullDescription}
                  </FormHelperText>
                )}
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
                  error={Boolean(validationErrors.website)}
                />
                {validationErrors.website && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.website}
                  </FormHelperText>
                )}
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
                  error={Boolean(validationErrors.github)}
                />
                {validationErrors.github && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.github}
                  </FormHelperText>
                )}
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
                    helperText={`Press Enter or tap + to add (${form.techStack.length}/${APP_LIMITS.techStackMax})`}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Add technology"
                            size="small"
                            onClick={addTech}
                            disabled={!newTech.trim() || form.techStack.length >= APP_LIMITS.techStackMax}
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
                {validationErrors.techStack && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {validationErrors.techStack}
                  </FormHelperText>
                )}
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
                    helperText={`Press Enter or tap + to add (${form.features.length}/${APP_LIMITS.featuresMax})`}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Add feature"
                            size="small"
                            onClick={addFeature}
                            disabled={!newFeature.trim() || form.features.length >= APP_LIMITS.featuresMax}
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
                {validationErrors.features && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {validationErrors.features}
                  </FormHelperText>
                )}
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
                  helperText={`Your name or company name (${form.authorName.length}/${APP_LIMITS.authorNameMax})`}
                  error={Boolean(validationErrors.authorName)}
                  FormHelperTextProps={{
                    sx: { 
                      color: form.authorName.length > APP_LIMITS.authorNameMax ? 'error.main' : 'text.secondary',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }
                  }}
                />
                {validationErrors.authorName && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.authorName}
                  </FormHelperText>
                )}
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
                  error={Boolean(validationErrors.authorEmail)}
                />
                {validationErrors.authorEmail && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.authorEmail}
                  </FormHelperText>
                )}
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
                  helperText={`A brief bio that will be displayed on your app page (${form.authorBio.length}/${APP_LIMITS.authorBioMax})`}
                  error={Boolean(validationErrors.authorBio)}
                  FormHelperTextProps={{
                    sx: { 
                      color: form.authorBio.length > APP_LIMITS.authorBioMax ? 'error.main' : 'text.secondary',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }
                  }}
                />
                {validationErrors.authorBio && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {validationErrors.authorBio}
                  </FormHelperText>
                )}
              </Grid>

              {/* Premium Upgrade Option */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                  <DollarSign size={24} color={theme.palette.primary.main} />
                  Premium Upgrade (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Boost your app's visibility with premium features. This is completely optional.
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        border: selectedPremiumPlan === 'premium' ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                        backgroundColor: selectedPremiumPlan === 'premium' ? `${theme.palette.primary.main}08` : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: `${theme.palette.primary.main}04`,
                        }
                      }}
                      onClick={() => handlePremiumSelection(selectedPremiumPlan === 'premium' ? null : 'premium')}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                          {selectedPremiumPlan === 'premium' && (
                            <Check 
                              size={24} 
                              color={theme.palette.primary.main} 
                              sx={{ mr: 1 }}
                            />
                          )}
                          <Star size={32} color={theme.palette.primary.main} />
                        </Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Premium Listing
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
                          $19
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          One-time payment • Lifetime benefits
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ textAlign: 'left' }}>
                          {premiumFeatures.slice(0, 4).map((feature, index) => (
                            <Box key={index} display="flex" alignItems="center" mb={1}>
                              <Check 
                                size={16} 
                                color={theme.palette.success.main} 
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2" fontSize="0.875rem">
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        border: selectedPremiumPlan === 'free' ? `2px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`,
                        backgroundColor: selectedPremiumPlan === 'free' ? `${theme.palette.success.main}08` : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: theme.palette.success.main,
                          backgroundColor: `${theme.palette.success.main}04`,
                        }
                      }}
                      onClick={() => handlePremiumSelection(selectedPremiumPlan === 'free' ? null : 'free')}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                          {selectedPremiumPlan === 'free' && (
                            <Check 
                              size={24} 
                              color={theme.palette.success.main} 
                              sx={{ mr: 1 }}
                            />
                          )}
                          <Typography variant="h4" color="success.main">🎉</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Free Listing
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="success.main" gutterBottom>
                          $0
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Standard listing • No additional cost
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ textAlign: 'left' }}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Check 
                              size={16} 
                              color={theme.palette.success.main} 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" fontSize="0.875rem">
                              Standard app listing
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Check 
                              size={16} 
                              color={theme.palette.success.main} 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" fontSize="0.875rem">
                              Community review process
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Check 
                              size={16} 
                              color={theme.palette.success.main} 
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" fontSize="0.875rem">
                              Basic analytics
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                                 {selectedPremiumPlan === 'premium' && (
                   <Box sx={{ mt: 3, p: 2, backgroundColor: `${theme.palette.primary.main}08`, borderRadius: 2, border: `1px solid ${theme.palette.primary.main}20` }}>
                     <Typography variant="body2" color="primary" fontWeight={500}>
                       ⭐ Premium selected! You'll be redirected to payment after submission.
                     </Typography>
                   </Box>
                 )}
                 
                 <Box sx={{ mt: 3, p: 2, backgroundColor: `${theme.palette.info.main}08`, borderRadius: 2, border: `1px solid ${theme.palette.info.main}20` }}>
                   <Typography variant="body2" color="info.main" fontWeight={500} gutterBottom>
                     💡 Having payment issues?
                   </Typography>
                   <Typography variant="body2" color="info.main">
                     If you've already paid but your premium features aren't working, you can{' '}
                     <Link href="/dashboard/payment-verification" style={{ color: theme.palette.info.main, textDecoration: 'underline' }}>
                       verify your payment status here
                     </Link>
                     .
                   </Typography>
                 </Box>
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
                    disabled={loading || Object.keys(validationErrors).length > 0}
                  >
                    {loading ? 'Submitting...' : 'Submit App for Review'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
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