"use client";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

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
} from "@mui/material";
import { Delete as DeleteIcon, KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon, Check } from "@mui/icons-material";
import { Star, BadgeCheck, DollarSign, UploadCloud, Github, Globe, User, Code } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { getSubcategorySuggestions, fetchCategoryNames } from "@/utils/categories";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "@/utils/themeUtils";

function SubmitAppPageContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
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

  // Fetch categories from API on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const apiCategories = await fetchCategoryNames('app');
        setCategories(apiCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to minimal categories
        setCategories([
          "Productivity", "Development", "Design", "Marketing", 
          "Analytics", "Communication", "Finance", "Education", "Entertainment"
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      // For subcategories, we show all available categories (excluding the main selected category)
      // This allows users to select multiple categories for their app
      if (categories.length > 0) {
        const availableSubcategories = categories.filter(cat => cat !== form.category);
        setSubcategories(availableSubcategories);
      }
    };

    loadSubcategories();
  }, [form.category, categories]);

  // Load draft data to restore form
  const loadDraftData = useCallback(async (draftId: string) => {
    try {
      const response = await fetch(`/api/user-apps/draft/${draftId}`);
      if (response.ok) {
        const draftData = await response.json();
        
        console.log('Loading draft data:', draftData);
        
        // Restore form with draft data
        const newFormData = {
          name: draftData.name || "",
          tagline: draftData.tagline || "",
          description: draftData.description || "",
          fullDescription: draftData.fullDescription || "",
          subcategories: draftData.subcategories || [],
          website: draftData.website || "",
          github: draftData.github || "",
          category: draftData.category || "",
          techStack: draftData.techStack || [],
          pricing: draftData.pricing || "Free",
          features: draftData.features || [],
          isInternal: draftData.isInternal || false,
          authorName: draftData.authorName || "",
          authorEmail: draftData.authorEmail || "",
          authorBio: draftData.authorBio || "",
        };
        
        console.log('Setting form data:', newFormData);
        setForm(newFormData);
        
        setSelectedPremiumPlan(draftData.premiumPlan || null);
        setIsEditing(true);
        setEditingAppId(draftId);
        hasLoadedDataRef.current = true;
      }
    } catch (error) {
      console.error('Error loading draft data:', error);
    }
  }, []);

  // Load published app data for editing
  const loadPublishedAppData = useCallback(async (appId: string) => {
    try {
      const response = await fetch(`/api/user-apps/${appId}`);
      if (response.ok) {
        const data = await response.json();
        const appData = data.app; // The API returns { app: {...} }
        
        console.log('Loading published app data:', appData);
        
        // Restore form with published app data
        const newFormData = {
          name: appData.name || "",
          tagline: appData.tagline || "",
          description: appData.description || "",
          fullDescription: appData.fullDescription || "",
          subcategories: appData.subcategories || [],
          website: appData.website || "",
          github: appData.github || "",
          category: appData.category || "",
          techStack: appData.techStack || [],
          pricing: appData.pricing || "Free",
          features: appData.features || [],
          isInternal: appData.isInternal || false,
          authorName: appData.authorName || "",
          authorEmail: appData.authorEmail || "",
          authorBio: appData.authorBio || "",
        };
        
        console.log('Setting form data:', newFormData);
        setForm(newFormData);
        
        // Don't set premium plan for published apps - they're already paid for
        setSelectedPremiumPlan(null);
        setIsEditing(true);
        setEditingAppId(appId);
        hasLoadedDataRef.current = true;
      }
    } catch (error) {
      console.error('Error loading published app data:', error);
    }
  }, []);

  // Check for payment success on component mount
  React.useEffect(() => {
    if (hasLoadedDataRef.current) return; // Prevent multiple loads
    
    const paymentSuccessParam = searchParams.get('payment_success');
    const draftId = searchParams.get('draftId');
    const appId = searchParams.get('appId');
    
    console.log('URL params:', { paymentSuccessParam, draftId, appId });
    
    if (paymentSuccessParam === 'true' && draftId) {
      setPaymentSuccess(true);
      setSuccess(true);
      
      // Load draft data to restore form
      loadDraftData(draftId);
      
      // Clear the URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment_success');
      url.searchParams.delete('draftId');
      window.history.replaceState({}, '', url.toString());
    } else if (appId) {
      // Load published app data for editing
      loadPublishedAppData(appId);
    } else if (draftId) {
      // Load draft data for editing (without payment success)
      loadDraftData(draftId);
    }
    
    hasLoadedDataRef.current = true;
  }, [searchParams, loadDraftData, loadPublishedAppData]);

  // Debug: Monitor form changes
  React.useEffect(() => {
    console.log('Form state changed:', form);
  }, [form]);

  // Debug: Monitor editing state changes
  React.useEffect(() => {
    console.log('Editing state changed:', { isEditing, editingAppId, hasLoadedData: hasLoadedDataRef.current });
  }, [isEditing, editingAppId]);

  // Debug: Monitor when form is reset to empty values
  React.useEffect(() => {
    if (form.name === "" && form.description === "" && isEditing) {
      console.log('⚠️ Form was reset to empty values while editing!');
      console.trace('Stack trace for form reset');
    }
  }, [form.name, form.description, isEditing]);

  const handleChange = (field: string, value: any) => {
    console.log(`Setting ${field} to:`, value);
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      console.log('New form state:', newForm);
      return newForm;
    });
  };

  // Feature management functions
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

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      setForm(prev => {
        const newFeatures = [...prev.features];
        [newFeatures[index], newFeatures[index - 1]] = [newFeatures[index - 1], newFeatures[index]];
        return { ...prev, features: newFeatures };
      });
    } else if (direction === 'down' && index < form.features.length - 1) {
      setForm(prev => {
        const newFeatures = [...prev.features];
        [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
        return { ...prev, features: newFeatures };
      });
    }
  };



  // Tech stack management functions
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

  const handleSubcategoryToggle = (subcategory: string) => {
    if (form.subcategories.includes(subcategory)) {
      setForm(prev => ({
        ...prev,
        subcategories: prev.subcategories.filter(s => s !== subcategory)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, subcategory]
      }));
    }
  };

  // Save app as draft
  const saveDraft = async (): Promise<string | null> => {
    try {
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
        premiumPlan: selectedPremiumPlan,
      };

      const res = await fetch("/api/user-apps/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Could not save draft");
      }

      const result = await res.json();
      return result.draftId;
    } catch (err: any) {
      console.error('Error saving draft:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Determine if we're editing a draft vs a published app
      const isEditingDraft = isEditing && editingAppId && searchParams.get('draftId') === editingAppId;
      const isEditingPublishedApp = isEditing && editingAppId && searchParams.get('appId') === editingAppId;
      
      // For published apps, we never go through premium flow since they're already paid
      // For drafts, premium selection can trigger payment/submission flow
      if (selectedPremiumPlan === 'premium') {
        // If we are editing a draft that may already be premium-ready, submit it directly
        if (isEditingDraft) {
          try {
            const draftRes = await fetch(`/api/user-apps/draft/${editingAppId}`);
            if (!draftRes.ok) {
              throw new Error('Failed to load draft details.');
            }
            const draftData = await draftRes.json();
            if (draftData?.premiumReady) {
              // Submit draft to apps (pending review)
              const submitRes = await fetch(`/api/user-apps/draft/${editingAppId}/submit`, {
                method: 'POST',
              });
              if (!submitRes.ok) {
                const j = await submitRes.json().catch(() => ({}));
                throw new Error(j.message || 'Failed to submit draft.');
              }
              setSuccess(true);
              setIsEditing(false);
              setEditingAppId(null);
              setSelectedPremiumPlan(null);
              return;
            }
          } catch (e: any) {
            console.error('Draft submit check failed:', e);
            // fall through to checkout flow
          }
        }

        // Not premium-ready yet → ensure we have a draft ID and create checkout
        let draftId: string | null = null;
        if (isEditingDraft) {
          draftId = editingAppId;
        } else {
          draftId = await saveDraft();
          if (!draftId) {
            throw new Error('Failed to save draft. Please try again.');
          }
        }

        try {
          const checkoutRes = await fetch("/api/lemonsqueezy/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variantId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_APP_LISTING_VARIANT_ID,
              custom: {
                subscription_type: "premium_app_listing",
                draft_id: draftId,
                app_name: form.name,
                return_url: `${window.location.origin}/dashboard/submission/app?draftId=${draftId}&payment_success=true`,
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
          setError(`Payment setup failed: ${checkoutError.message}. Your draft was saved and you can retry payment later.`);
          setSuccess(true);
          return;
        }
      } else {
        // Free app - submit directly or update existing
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
          premiumPlan: selectedPremiumPlan,
        };

        // For published apps, always update directly (no payment needed)
        // For drafts, submit to apps collection
        let url: string;
        let method: string;
        
        if (isEditingPublishedApp) {
          // Editing a published app - just update it
          url = `/api/user-apps/${editingAppId}`;
          method = "PUT";
        } else if (isEditingDraft) {
          // Editing a draft - submit it to apps
          const submitRes = await fetch(`/api/user-apps/draft/${editingAppId}/submit`, {
            method: 'POST',
          });
          if (!submitRes.ok) {
            const j = await submitRes.json().catch(() => ({}));
            throw new Error(j.message || 'Failed to submit draft.');
          }
          setSuccess(true);
          setIsEditing(false);
          setEditingAppId(null);
          return;
        } else {
          // New app - create it
          url = "/api/user-apps";
          method = "POST";
        }

        // Only make the fetch call for published app updates and new apps
        if (url && method) {
          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.message || `Could not ${isEditing ? 'update' : 'save'} app`);
          }
        }
        
        setSuccess(true);
        if (!isEditing) {
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
        }
        
        // Reset editing state after successful submission
        if (isEditing) {
          // Don't reset immediately - let user see the success message
          // The form will stay in editing mode until they click "New App" or navigate away
        }
      }
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
            {paymentSuccess 
              ? "🎉 Payment successful! Your app draft has been restored. You can now complete your submission with premium features activated."
              : isEditing 
                ? "App updated successfully! Your changes have been saved."
                : "App submitted successfully! We'll review it and get back to you soon."
            }
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ ...getGlassStyles(theme), p: 4, borderRadius: "1.5rem", boxShadow: getShadow(theme, "elegant"), position: 'relative' }}>
          {loading && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              bgcolor: 'rgba(255,255,255,0.8)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 1,
              borderRadius: "1.5rem"
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" mb={1}>
                  {isEditing ? 'Updating your app...' : 'Submitting your app...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we process your {isEditing ? 'update' : 'submission'}
                </Typography>
              </Box>
            </Box>
          )}
          
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
                  disabled={isEditing && loading}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={form.category}
                    label="Category"
                    onChange={(e) => handleChange("category", e.target.value)}
                    disabled={categoriesLoading}
                  >
                    {categoriesLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading categories...
                      </MenuItem>
                    ) : (
                      categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {categoriesLoading && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Loading categories from database...
                    </Typography>
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
                  helperText="A short, catchy description that appears in listings (max 100 characters)"
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
                  helperText="A concise description for listings and previews (100-200 characters)"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Full Description"
                  multiline
                  rows={6}
                  fullWidth
                  placeholder="Tell the full story of your app, its features, benefits, target audience, and what makes it unique"
                  value={form.fullDescription}
                  onChange={(e) => handleChange("fullDescription", e.target.value)}
                  helperText="Detailed description for the app page. Include use cases, benefits, and what problems it solves."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                  Additional Categories (Optional - Select multiple categories)
                </Typography>
                {subcategories.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {subcategories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => {
                          const isSelected = form.subcategories.includes(category);
                          if (isSelected) {
                            setForm(prev => ({
                              ...prev,
                              subcategories: prev.subcategories.filter(s => s !== category)
                            }));
                          } else {
                            setForm(prev => ({
                              ...prev,
                              subcategories: [...prev.subcategories, category]
                            }));
                          }
                        }}
                        color={form.subcategories.includes(category) ? "primary" : "default"}
                        variant={form.subcategories.includes(category) ? "filled" : "outlined"}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select a main category first to see additional category options.
                  </Typography>
                )}
                {form.subcategories.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Selected additional categories:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {form.subcategories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          onDelete={() => {
                            setForm(prev => ({
                              ...prev,
                              subcategories: prev.subcategories.filter((_, i) => i !== index)
                            }));
                          }}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Additional categories help users discover your app. Select relevant categories that apply to your app (excluding the main category you already selected).
                </Typography>
              </Grid>

              {/* Links and URLs */}
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

              {/* Technical Details */}
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
                    onKeyPress={(e) => e.key === 'Enter' && addTech()}
                    helperText="Press Enter or click Add to add a technology"
                  />
                  <Button
                    variant="outlined"
                    onClick={addTech}
                    disabled={!newTech.trim()}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
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

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                  Key Features
                </Typography>
                {/* Feature Input */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    label="Add a feature"
                    fullWidth
                    placeholder="e.g. Real-time collaboration, AI-powered suggestions, Cross-platform sync..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    helperText="Press Enter or click Add to add a feature"
                  />
                  <Button
                    variant="outlined"
                    onClick={addFeature}
                    disabled={!newFeature.trim()}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
                </Box>
                
                {/* Features List */}
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
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => moveFeature(index, 'up')}
                          disabled={index === 0}
                        >
                          <UpIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => moveFeature(index, 'down')}
                          disabled={index === form.features.length - 1}
                        >
                          <DownIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeFeature(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
                
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                  Focus on the most important features that solve real problems for your users
                </Typography>
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
                  placeholder="Tell us about yourself, your background, and what inspired you to create this app"
                  value={form.authorBio}
                  onChange={(e) => handleChange("authorBio", e.target.value)}
                  helperText="A brief bio that will be displayed on your app page"
                />
              </Grid>

              {/* Screenshots & Media */}
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                  <UploadCloud size={24} color={theme.palette.primary.main} />
                  Screenshots & Media
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: "12px",
                    textAlign: "center",
                    p: 4,
                    color: "text.secondary",
                    cursor: "pointer",
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <UploadCloud size={28} />
                  <Typography mt={1}>Drag and drop your screenshots here</Typography>
                  <Typography variant="caption">Upload 3-5 high-quality images (PNG/JPG) showcasing your app</Typography>
                  <Button sx={{ mt: 2 }} variant="outlined" size="small">Choose Files</Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                  Settings
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isInternal}
                      onChange={(e) => handleChange("isInternal", e.target.checked)}
                    />
                  }
                  label="Internal Tool (Only visible to your organization)"
                />
              </Grid>

              {/* Premium Upgrade Option - Only show for new apps or drafts, not published apps */}
              {(!isEditing || (isEditing && searchParams.get('draftId') === editingAppId)) && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                    Premium Upgrade (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Boost your app's visibility with premium features. This is completely optional.
                  </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper 
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
                      onClick={() => setSelectedPremiumPlan(selectedPremiumPlan === 'premium' ? null : 'premium')}
                    >
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                          {selectedPremiumPlan === 'premium' && (
                            <Box sx={{ mr: 1, color: 'primary.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 24 }} />
                            </Box>
                          )}
                          <Box sx={{ color: 'primary.main', display: 'inline-flex' }}>
                            <Star size={32} />
                          </Box>
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
                          <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="body2" fontSize="0.875rem">
                              Verified badge and premium placement
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="body2" fontSize="0.875rem">
                              Priority review process (24-48 hours)
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="body2" fontSize="0.875rem">
                              Enhanced app analytics and insights
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="body2" fontSize="0.875rem">
                              Featured in premium app showcase
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper 
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
                      onClick={() => setSelectedPremiumPlan(selectedPremiumPlan === 'free' ? null : 'free')}
                    >
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                          {selectedPremiumPlan === 'free' && (
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 24 }} />
                            </Box>
                          )}
                          <Typography variant="h4" color="success.main">🚀</Typography>
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
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="body2" fontSize="0.875rem">
                              Standard app listing
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="body2" fontSize="0.875rem">
                              Community review process
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{ mr: 1, color: 'success.main', display: 'inline-flex' }}>
                              <Check sx={{ fontSize: 16 }} />
                            </Box>
                            <Typography variant="body2" fontSize="0.875rem">
                              Basic analytics
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                
                {selectedPremiumPlan === 'premium' && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: `${theme.palette.primary.main}08`, borderRadius: 2, border: `1px solid ${theme.palette.primary.main}20` }}>
                    <Typography variant="body2" color="primary" fontWeight={500}>
                      💡 Premium selected! You'll be redirected to payment after submission.
                    </Typography>
                  </Box>
                )}
                </Grid>
              )}

              {/* Review Process */}
              <Grid item xs={12}>
                <Box mt={4}>
                  <Typography variant="subtitle1" fontWeight={700} mb={2}>
                    Review Process
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1.5}>
                    {reviewSteps.map((step, index) => (
                      <Chip
                        key={step}
                        label={`${index + 1}. ${step}`}
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
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    We review all submissions within 48-72 hours. Premium submissions get priority review.
                  </Typography>
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box mt={4} textAlign="center" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {isEditing && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingAppId(null);
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
                        setSuccess(false);
                        setError(null);
                      }}
                      sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
                    >
                      New App
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    sx={{ borderRadius: "999px", px: 6, py: 1.5 }}
                    startIcon={<Star size={20} />}
                    disabled={loading || !form.name || !form.description}
                  >
                    {loading ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update App' : 'Submit App for Review')}
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
