"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Alert,
  IconButton,
  Paper,
  FormHelperText,
} from "@mui/material";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { getSubcategorySuggestions, type BlogCategory, fetchCategoryNames } from "../../../../../utils/categories";
import { compressImage, validateImage, type CompressedImage } from "../../../../../utils/imageCompression";
import { extractDomain } from "../../../../../utils/founderDomainStorage";

export type FounderDomainStatus = "unknown" | "checking" | "ok" | "taken" | "invalid";

export type FounderDomainCheck = {
  status: FounderDomainStatus;
  message?: string;
};

export interface BlogMetadata {
  title: string;
  author: string;
  role: string;
  category: BlogCategory | "";
  subcategories: string[];
  authorBio: string;
  excerpt: string;
  content: string;
  isFounderStory?: boolean;
  founderUrl?: string;
  founderDomainCheck?: FounderDomainCheck;
  imageFile?: CompressedImage;
  imageUrl?: string;
}
interface StepMetadataProps {
  formData: BlogMetadata;
  setFormData: (data: Partial<BlogMetadata>) => void;
  errors?: Partial<Record<
    | "title"
    | "author"
    | "role"
    | "category"
    | "authorBio"
    | "founderUrl"
    | "tags"
    | "excerpt",
    string
  >>;
}


export default function StepMetadata({ formData, setFormData, errors = {} }: StepMetadataProps) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  // Fetch categories from API on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const apiCategories = await fetchCategoryNames('blog');
        setCategories(apiCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to minimal categories
        setCategories([
          "Technology", "Business", "Development", "Design", 
          "Marketing", "Productivity", "Startup", "Tutorial", "AI", "Web3"
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
      // This allows users to select multiple categories for their blog
      if (categories.length > 0) {
        const availableSubcategories = categories.filter(cat => cat !== formData.category);
        setSubcategories(availableSubcategories);
      }
    };

    loadSubcategories();
  }, [formData.category, categories]);
  const [compressing, setCompressing] = useState(false);

  // Image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image
    const validationError = validateImage(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setCompressing(true);
    setImageError(null);

    try {
      const compressed = await compressImage(file, 1); // 1MB limit
      setFormData({ imageFile: compressed });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Failed to compress image');
    } finally {
      setCompressing(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData({ imageFile: undefined, imageUrl: undefined });
    setImageError(null);
  };

  // Subcategory selection handler
  const handleSubcategoryToggle = (subcategory: string) => {
    const currentSubcategories = formData.subcategories || [];
    const newSubcategories = currentSubcategories.includes(subcategory)
      ? currentSubcategories.filter(s => s !== subcategory)
      : [...currentSubcategories, subcategory];
    setFormData({ subcategories: newSubcategories });
  };

  // Client-side URL validation  // Founder URL validation - frontend only, no domain uniqueness check
  useEffect(() => {
    let timer: any;
    const url = formData.founderUrl ?? "";
    const domain = extractDomain(url);
    
    if (!formData.isFounderStory) {
      setFormData({ founderDomainCheck: { status: "unknown", message: "" } });
      return;
    }
    
    if (!url.trim()) {
      setFormData({ founderDomainCheck: { status: "unknown", message: "" } });
      return;
    }
    
    if (!domain) {
      setFormData({ founderDomainCheck: { status: "invalid", message: "Please enter a valid URL (e.g., https://yourblog.com/post)" } });
      return;
    }
    
    timer = setTimeout(async () => {
      // Basic domain format validation
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        setFormData({ founderDomainCheck: { status: "invalid", message: "Please enter a valid domain name" } });
        return;
      }

      // URL format validation
      try {
        const urlObj = new URL(url);
      } catch {
        setFormData({ founderDomainCheck: { status: "invalid", message: "Invalid URL format" } });
        return;
      }

      // Set checking status
      setFormData({ founderDomainCheck: { status: "checking", message: "Checking URL accessibility..." } });

      // Try to check URL accessibility (may be blocked by CORS)
      try {
        const response = await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-cache' });
        setFormData({ founderDomainCheck: { status: "ok", message: "✓ URL appears to be accessible" } });
      } catch {
        // If fetch fails (likely due to CORS), still consider it valid if format is correct
        setFormData({ founderDomainCheck: { status: "ok", message: "✓ URL format valid (note: accessibility check may be blocked by CORS)" } });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.isFounderStory, formData.founderUrl]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Blog Information
      </Typography>
      
      {/* Validation Summary - Only show if user has interacted with fields */}
      {Object.keys(errors).length > 0 && Object.values(errors).some(error => error && error.trim()) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Please complete the required fields:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {Object.entries(errors)
              .filter(([field, message]) => message && message.trim())
              .map(([field, message]) => (
              <Box component="li" key={field} sx={{ mb: 0.5 }}>
                <Typography variant="body2">
                  <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {message}
                </Typography>
              </Box>
            ))}
          </Box>
        </Alert>
      )}
      <Grid container spacing={3}>
        {/* Existing fields (title, author, role, tags, authorBio) unchanged */}
        <Grid item xs={12}>
          <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ title: e.target.value })} required error={Boolean(errors.title)} helperText={errors.title}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Author Name" value={formData.author} onChange={(e) => setFormData({ author: e.target.value })} required error={Boolean(errors.author)} helperText={errors.author}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Author Role" value={formData.role} onChange={(e) => setFormData({ role: e.target.value })} required error={Boolean(errors.role)} helperText={errors.role}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required error={Boolean(errors.category)}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ category: e.target.value as BlogCategory })}
              disabled={categoriesLoading}
            >
              {categoriesLoading ? (
                <MenuItem disabled>Loading categories...</MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))
              )}
            </Select>
            {errors.category && (
              <FormHelperText error>{errors.category}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Additional Categories (Optional - Select multiple categories)
          </Typography>
          {subcategories.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {subcategories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleSubcategoryToggle(category)}
                  color={formData.subcategories?.includes(category) ? "primary" : "default"}
                  variant={formData.subcategories?.includes(category) ? "filled" : "outlined"}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Select a main category first to see additional category options.
            </Typography>
          )}
          {formData.subcategories && formData.subcategories.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Selected additional categories:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.subcategories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    onDelete={() => {
                      const newSubcategories = formData.subcategories?.filter((_, i) => i !== index) || [];
                      setFormData({ subcategories: newSubcategories });
                    }}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Additional categories help users discover your content. Select relevant categories that apply to your blog (excluding the main category you already selected).
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            multiline 
            minRows={3} 
            maxRows={5} 
            label="Author Bio" 
            value={formData.authorBio} 
            onChange={(e) => setFormData({ authorBio: e.target.value })} 
            required 
            error={Boolean(errors.authorBio)} 
            helperText={errors.authorBio || `Tell us about yourself. This will appear with your content submissions. (${formData.authorBio?.length || 0}/500 characters)`}
            inputProps={{ maxLength: 500 }}
          />
        </Grid>

        {/* Tags input */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tags (comma separated)"
            placeholder="e.g. nextjs, seo, performance"
            value={(formData as any).tagsInput || (formData as any).tags?.join(', ') || ''}
            onChange={(e) => setFormData({ ...(formData as any), tagsInput: e.target.value, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) as any })}
            required
            error={Boolean(errors.tags)}
            helperText={errors.tags || "Use 3-8 relevant tags for discoverability"}
          />
        </Grid>

        {/* Excerpt */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Excerpt"
            placeholder="Short summary for previews and SEO snippets"
            value={formData.excerpt || ''}
            onChange={(e) => setFormData({ excerpt: e.target.value })}
            inputProps={{ maxLength: 160 }}
            required
            error={Boolean(errors.excerpt)}
            helperText={errors.excerpt || `${(formData.excerpt || '').length}/160`}
          />
        </Grid>

        {/* Blog Image Upload */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Blog Image (Optional)
          </Typography>
          <Paper sx={{ p: 2, border: '2px dashed', borderColor: 'divider' }}>
            {formData.imageFile ? (
              <Box sx={{ position: 'relative' }}>
                <img
                  src={formData.imageFile.dataUrl}
                  alt="Blog preview"
                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                />
                <IconButton
                  onClick={removeImage}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)' }}
                >
                  <X color="white" size={16} />
                </IconButton>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Size: {(formData.imageFile.size / 1024 / 1024).toFixed(2)}MB 
                    ({(formData.imageFile.compressionRatio).toFixed(0)}% smaller)
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    ✓ Compressed to WebP
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="blog-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={compressing}
                />
                <label htmlFor="blog-image-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={compressing ? <CircularProgress size={16} /> : <Upload />}
                    disabled={compressing}
                  >
                    {compressing ? 'Compressing...' : 'Upload Image'}
                  </Button>
                </label>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Max 5MB, will be compressed to WebP format (≤1MB)
                </Typography>
              </Box>
            )}
          </Paper>
          {imageError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {imageError}
            </Alert>
          )}
        </Grid>

        {/* Founder story toggle */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(formData.isFounderStory)}
                onChange={(e) => setFormData({ 
                  isFounderStory: e.target.checked, 
                  founderUrl: e.target.checked ? formData.founderUrl : "", 
                  founderDomainCheck: { status: "unknown" } 
                })}
              />
            }
            label="This submission is a Founder Story (link to a blog post on your site)"
          />
        </Grid>

        {/* Founder URL input (only when checked) */}
        {formData.isFounderStory && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Founder story URL"
                placeholder="https://yourwebsite.com"
                value={formData.founderUrl ?? ""}
                onChange={(e) => setFormData({ founderUrl: e.target.value })}
                helperText="Link to your website where the founder badge will be displayed. We'll check if the URL is accessible."
                required
                error={Boolean(errors.founderUrl)}
                FormHelperTextProps={{ error: Boolean(errors.founderUrl) }}
                // Show validation error if present
                
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 24 }}>
                {formData.founderDomainCheck?.status === "checking" && <CircularProgress size={16} />}
                {formData.founderDomainCheck?.message && (
                  <Typography variant="body2" color={
                    formData.founderDomainCheck?.status === "ok"
                      ? "success.main"
                      : formData.founderDomainCheck?.status === "taken"
                      ? "error.main"
                      : formData.founderDomainCheck?.status === "invalid"
                      ? "error.main"
                      : "text.secondary"
                  }>
                    {formData.founderDomainCheck.message}
                  </Typography>
                )}
                {!formData.founderDomainCheck?.message && formData.founderUrl?.trim() === "" && (
                  <Typography variant="body2" color="text.secondary">
                    Enter your blog post URL for validation
                  </Typography>
                )}
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
