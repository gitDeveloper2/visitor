"use client";

import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

export interface BlogMetadata {
  title: string;
  author: string;
  role: string;
  tags: string;
  authorBio: string;
  content: string;
}

interface StepMetadataProps {
  formData: BlogMetadata;
  setFormData: (data: Partial<BlogMetadata>) => void; // ✅ Partial accepted
}

export default function StepMetadata({ formData, setFormData }: StepMetadataProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Blog Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ title: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Author Name"
            value={formData.author}
            onChange={(e) => setFormData({ author: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Author Role"
            value={formData.role}
            onChange={(e) => setFormData({ role: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tags"
            helperText="Separate with commas, e.g., React, WebDev, UX"
            value={formData.tags}
            onChange={(e) => setFormData({ tags: e.target.value })}
            required
          />
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
          />
        </Grid>
      </Grid>
    </Box>
  );
}
