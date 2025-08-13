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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Divider,
  Alert,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BadgeCheck, DollarSign, UploadCloud, Github, Globe, User, Code, Star, ArrowUp, ArrowDown, X } from "lucide-react";
import { KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { getGlassStyles, getShadow, typographyVariants, commonStyles } from "@/utils/themeUtils";
import { useState, useEffect } from "react";
import PremiumAppListing from '@/components/premium/PremiumAppListing';

// App categories for selection
const categories = [
  "Productivity", "Development", "Design", "Marketing", 
  "Analytics", "Communication", "Finance", "Education", "Entertainment"
];

// Pricing options
const pricingOptions = ["Free", "Freemium", "One-time", "Subscription", "Enterprise"];

// Tech stack suggestions
const techStackSuggestions = [
  "React", "Vue", "Angular", "Node.js", "Python", "Java", "C#", "PHP",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "GCP",
  "Docker", "Kubernetes", "GraphQL", "REST API", "TypeScript", "JavaScript"
];

export default function SubmitAppPage() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    fullDescription: "",
    website: "",
    github: "",
    category: "",
    pricing: "",
    tags: [] as string[], // Changed to array
    techStack: [] as string[], // Changed to array
    features: [] as string[], // Changed to array
    authorName: "",
    authorEmail: "",
    authorBio: "",
  });
  
  // Feature management state
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newTech, setNewTech] = useState("");
  
  // Check authentication status
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          if (session.user) {
            setAuthStatus('authenticated');
            // Pre-fill author information from session if available
            if (session.user.name && !formData.authorName) {
              setFormData(prev => ({ ...prev, authorName: session.user.name }));
            }
            if (session.user.email && !formData.authorEmail) {
              setFormData(prev => ({ ...prev, authorEmail: session.user.email }));
            }
          } else {
            setAuthStatus('unauthenticated');
          }
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthStatus('unauthenticated');
      }
    };
    
    checkAuth();
  }, []);

  const reviewSteps = ["Initial Review", "Quality Check", "Publication"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Feature management functions
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };
  
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  const moveFeature = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      setFormData(prev => {
        const newFeatures = [...prev.features];
        [newFeatures[index], newFeatures[index - 1]] = [newFeatures[index - 1], newFeatures[index]];
        return { ...prev, features: newFeatures };
      });
    } else if (direction === 'down' && index < formData.features.length - 1) {
      setFormData(prev => {
        const newFeatures = [...prev.features];
        [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
        return { ...prev, features: newFeatures };
      });
    }
  };

  // Tag management functions
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Tech stack management functions
  const addTech = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      // Client-side validation
      if (!formData.name.trim()) {
        throw new Error('App name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('App description is required');
      }
      if (!formData.category) {
        throw new Error('Please select a category');
      }
      if (!formData.authorName.trim()) {
        throw new Error('Author name is required');
      }
      if (!formData.authorEmail.trim()) {
        throw new Error('Author email is required');
      }
      
      // Process the data before submission
      const processedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        tagline: formData.tagline.trim(),
        fullDescription: formData.fullDescription.trim(),
        website: formData.website.trim(),
        github: formData.github.trim(),
        category: formData.category,
        pricing: formData.pricing,
        tags: formData.tags, // Already an array, no need to split
        techStack: formData.techStack, // Already an array, no need to split
        features: formData.features, // Already an array, no need to split
        authorName: formData.authorName.trim(),
        authorEmail: formData.authorEmail.trim(),
        authorBio: formData.authorBio.trim(),
        isInternal: false, // Default to false for public submissions
      };
      
      console.log("Form data:", processedData);
      console.log("Submitting to API:", '/api/user-apps');
      
      // Submit to API
      const response = await fetch('/api/user-apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData)
      });
      
      console.log("API Response status:", response.status);
      console.log("API Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit app');
      }
      
      const result = await response.json();
      setSubmitStatus({
        type: 'success',
        message: 'App submitted successfully! We\'ll review it within 48-72 hours.'
      });
      
              // Reset form after successful submission
        setFormData({
          name: "",
          tagline: "",
          description: "",
          fullDescription: "",
          website: "",
          github: "",
          category: "",
          pricing: "",
          tags: [], // Reset to empty array
          techStack: [], // Reset to empty array
          features: [], // Reset to empty array
          authorName: "",
          authorEmail: "",
          authorBio: "",
        });
        setNewFeature(""); // Reset feature input
        setNewTag(""); // Reset tag input
        setNewTech(""); // Reset tech stack input
      
    } catch (error: any) {
      console.error('Submission error:', error);
      let errorMessage = 'Failed to submit app. Please try again.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="main" sx={{ bgcolor: "background.default", py: 10 }}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography variant="h2" sx={typographyVariants.sectionTitle} textAlign="center">
          Submit Your <Box component="span" sx={commonStyles.textGradient}>App</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" mt={2} mb={6}>
          Share your innovation with thousands of tech enthusiasts and get the visibility you deserve.
        </Typography>

        {/* Authentication Status */}
        {authStatus === 'checking' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Checking authentication status...
          </Alert>
        )}
        
        {authStatus === 'unauthenticated' && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You need to be logged in to submit an app. Please sign in first.
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ ml: 2 }}
              onClick={() => window.location.href = '/auth/signin'}
            >
              Sign In
            </Button>
          </Alert>
        )}
        
        {/* Form */}
        <Paper sx={{ ...getGlassStyles(theme), p: 4, borderRadius: "1.5rem", boxShadow: getShadow(theme, "elegant"), position: 'relative' }}>
          {isSubmitting && (
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
                  Submitting your app...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we process your submission
                </Typography>
              </Box>
            </Box>
          )}
          <form onSubmit={handleSubmit}>
            {authStatus === 'unauthenticated' && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'action.disabledBackground', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Form disabled - authentication required
                </Typography>
              </Box>
            )}
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
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  helperText="Choose a memorable and descriptive name"
                  disabled={authStatus !== 'authenticated' || isSubmitting}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Tagline"
                  fullWidth
                  required
                  placeholder="A brief, compelling description of your app"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
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
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
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
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  helperText="Detailed description for the app page. Include use cases, benefits, and what problems it solves."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Add a tag"
                    fullWidth
                    placeholder="e.g. React, Mobile, Productivity, AI, SaaS"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    helperText="Press Enter or click Add to add a tag"
                    disabled={authStatus !== 'authenticated' || isSubmitting}
                  />
                  <Button
                    variant="outlined"
                    onClick={addTag}
                    disabled={!newTag.trim() || authStatus !== 'authenticated' || isSubmitting}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
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
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
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
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
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
                    disabled={authStatus !== 'authenticated' || isSubmitting}
                  />
                  <Button
                    variant="outlined"
                    onClick={addTech}
                    disabled={!newTech.trim() || authStatus !== 'authenticated' || isSubmitting}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.techStack.map((tech, index) => (
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
                    value={formData.pricing}
                    label="Pricing Model"
                    onChange={(e) => handleInputChange("pricing", e.target.value)}
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
                    disabled={authStatus !== 'authenticated' || isSubmitting}
                  />
                  <Button
                    variant="outlined"
                    onClick={addFeature}
                    disabled={!newFeature.trim() || authStatus !== 'authenticated' || isSubmitting}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
                </Box>
                
                {/* Features List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  {formData.features.map((feature, index) => (
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
                          disabled={index === formData.features.length - 1}
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
                  value={formData.authorName}
                  onChange={(e) => handleInputChange("authorName", e.target.value)}
                  helperText="Your name or company name"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Author Email" 
                  type="email"
                  required
                  value={formData.authorEmail}
                  onChange={(e) => handleInputChange("authorEmail", e.target.value)}
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
                  value={formData.authorBio}
                  onChange={(e) => handleInputChange("authorBio", e.target.value)}
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

              {/* Premium Section */}
              <Grid item xs={12}>
                                 <Box
                   sx={{
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
                   <Typography variant="body2" color="text.secondary">
                     Get a verified badge, priority placement, analytics insights, and faster review process for your app.
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
              </Grid>

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

              {/* Status Messages */}
              {submitStatus.type && (
                <Grid item xs={12}>
                  <Alert 
                    severity={submitStatus.type} 
                    sx={{ mt: 2 }}
                    onClose={() => setSubmitStatus({ type: null, message: '' })}
                  >
                    {submitStatus.message}
                  </Alert>
                </Grid>
              )}

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
                    disabled={isSubmitting || authStatus !== 'authenticated'}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit App for Review'}
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
