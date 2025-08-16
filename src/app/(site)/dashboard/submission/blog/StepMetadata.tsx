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
} from "@mui/material";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { blogCategories, blogTags, type BlogCategory, type BlogTag } from "../../../../../utils/categories";
import { compressImage, validateImage, type CompressedImage } from "../../../../../utils/imageCompression";

export type FounderDomainStatus = "unknown" | "checking" | "ok" | "taken" | "invalid";

export type FounderDomainCheck = {
  status: FounderDomainStatus;
  message: string;
};

export interface BlogMetadata {
  title: string;
  author: string;
  role: string;
  category: BlogCategory | "";
  tags: string[];
  authorBio: string;
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
}

function extractDomain(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export default function StepMetadata({ formData, setFormData }: StepMetadataProps) {
  const [imageError, setImageError] = useState<string | null>(null);
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

  // Tag selection handler
  const handleTagToggle = (tag: BlogTag) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setFormData({ tags: newTags });
  };

  // debounced domain check
  useEffect(() => {
    let timer: any;
    const url = formData.founderUrl ?? "";
    const domain = extractDomain(url);
    if (!formData.isFounderStory) {
      // reset
      setFormData({ founderDomainCheck: { status: "unknown", message: "" } });
      return;
    }
    if (!url) {
      setFormData({ founderDomainCheck: { status: "invalid", message: "Enter a URL" } });
      return;
    }
    if (!domain) {
      setFormData({ founderDomainCheck: { status: "invalid", message: "Invalid URL" } });
      return;
    }

    setFormData({ founderDomainCheck: { status: "checking", message: "Checking domain..." } });

    timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/founder-story/check?domain=${encodeURIComponent(domain)}`);
        const j = await res.json();
        // expected { status: 'ok' } | { status: 'taken', existingAppSlug: '...' }
        if (res.ok && j.status === "ok") {
          setFormData({ founderDomainCheck: { status: "ok", message: "Domain available" } });
        } else if (res.ok && j.status === "taken") {
          setFormData({ founderDomainCheck: { status: "taken", message: `Already used by ${j.existingAppSlug}` } });
        } else {
          setFormData({ founderDomainCheck: { status: "invalid", message: j.error || "Check failed" } });
        }
      } catch (e) {
        setFormData({ founderDomainCheck: { status: "invalid", message: "Network error" } });
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [formData.isFounderStory, formData.founderUrl]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Blog Information
      </Typography>
      <Grid container spacing={3}>
        {/* Existing fields (title, author, role, tags, authorBio) unchanged */}
        <Grid item xs={12}>
          <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ title: e.target.value })} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Author Name" value={formData.author} onChange={(e) => setFormData({ author: e.target.value })} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Author Role" value={formData.role} onChange={(e) => setFormData({ role: e.target.value })} required />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ category: e.target.value as BlogCategory })}
            >
              {blogCategories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Tags (Select multiple)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {blogTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagToggle(tag)}
                color={formData.tags?.includes(tag) ? "primary" : "default"}
                variant={formData.tags?.includes(tag) ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
          {formData.tags && formData.tags.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              Selected: {formData.tags.join(', ')}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={3} maxRows={5} label="Author Bio" value={formData.authorBio} onChange={(e) => setFormData({ authorBio: e.target.value })} required />
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
                placeholder="https://yourblog.com/my-founder-story"
                value={formData.founderUrl ?? ""}
                onChange={(e) => setFormData({ founderUrl: e.target.value })}
                helperText="One founder story allowed per domain. We'll check domain availability."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {formData.founderDomainCheck?.status === "checking" && <CircularProgress size={16} />}
                <Typography variant="body2" color={
                  formData.founderDomainCheck?.status === "ok"
                    ? "success.main"
                    : formData.founderDomainCheck?.status === "taken"
                    ? "error.main"
                    : "text.secondary"
                }>
                  {formData.founderDomainCheck?.message || "Enter a URL to check domain"}
                </Typography>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
