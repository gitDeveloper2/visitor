"use client";

import React, { useState } from "react";
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
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon, Star, Check } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function SubmitAppPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newTech, setNewTech] = useState("");
  const [selectedPremiumPlan, setSelectedPremiumPlan] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    website: "",
    github: "",
    category: "",
    techStack: [] as string[],
    pricing: "Free",
    features: [] as string[],
    isInternal: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
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

  // Tag management functions
  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        tags: form.tags,
        website: form.website,
        github: form.github,
        category: form.category,
        techStack: form.techStack,
        pricing: form.pricing,
        features: form.features,
        isInternal: form.isInternal,
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
      
      // If premium was selected and checkout URL is provided, redirect to payment
      if (result.requiresPayment && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      
      setSuccess(true);
      setForm({ 
        name: "", 
        description: "", 
        tags: [],
        website: "",
        github: "",
        category: "",
        techStack: [],
        pricing: "Free",
        features: [],
        isInternal: false
      });
      setSelectedPremiumPlan(null);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Submit Your App
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Share your amazing app with the developer community. We'll review it and publish it on our platform.
        </Typography>
        
        {/* Progress Steps */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {reviewSteps.map((step, index) => (
            <Chip
              key={step}
              label={step}
              variant={index === 0 ? "filled" : "outlined"}
              color={index === 0 ? "primary" : "default"}
              size="small"
            />
          ))}
        </Box>
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

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Basic Information */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
            Basic Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                label="App Name" 
                name="name" 
                value={form.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                fullWidth 
                required 
                placeholder="Enter your app name"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                label="Description" 
                name="description" 
                value={form.description} 
                onChange={(e) => handleChange("description", e.target.value)} 
                fullWidth 
                required 
                multiline 
                rows={3}
                placeholder="Brief description of what your app does"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Website" 
                name="website" 
                value={form.website} 
                onChange={(e) => handleChange("website", e.target.value)} 
                placeholder="https://yourapp.com"
                helperText="Optional: Your app's website"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="GitHub Repository" 
                name="github" 
                value={form.github} 
                onChange={(e) => handleChange("github", e.target.value)} 
                placeholder="https://github.com/username/repo"
                helperText="Optional: Link to your source code"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Add a tag"
                  fullWidth
                  placeholder="e.g. React, Mobile, Productivity"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  helperText="Press Enter or click Add to add a tag"
                />
                <Button
                  variant="outlined"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  sx={{ minWidth: { xs: '100%', sm: 100 } }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {form.tags.map((tag, index) => (
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
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                Tech Stack
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Add technology"
                  fullWidth
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTech()}
                  helperText="Press Enter or click Add to add a technology"
                />
                <Button
                  variant="outlined"
                  onClick={addTech}
                  disabled={!newTech.trim()}
                  sx={{ minWidth: { xs: '100%', sm: 100 } }}
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
          </Grid>
        </Paper>

        {/* App Details */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
            App Details
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  label="Category"
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                  sx={{ minWidth: { xs: '100%', sm: 100 } }}
                >
                  Add
                </Button>
              </Box>
              
              {/* Features List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
            </Grid>
          </Grid>
        </Paper>

        {/* Settings */}
        <Paper sx={{ p: 3 }}>
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
        </Paper>

        {/* Premium Upgrade Option */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
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
                💡 Premium selected! You'll be redirected to payment after submission.
              </Typography>
            </Box>
          )}
        </Paper>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !form.name || !form.description}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          {loading ? "Submitting..." : "Submit App"}
        </Button>
      </Box>
    </Container>
  );
}
