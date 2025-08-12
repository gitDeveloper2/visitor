// StepMetadata.tsx (modified)
"use client";
import React, { useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
// types.ts (create or add to existing file)
export type FounderDomainStatus = "unknown" | "checking" | "ok" | "taken" | "invalid";

export type FounderDomainCheck = {
  status: FounderDomainStatus;
  message?: string;
};



export interface BlogMetadata {
  title: string;
  author: string;
  role: string;
  tags: string;
  authorBio: string;
  content: string;
  isFounderStory?: boolean;
  founderUrl?: string;
  founderDomainCheck?: FounderDomainCheck; // <- uses the union
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
          <TextField fullWidth label="Tags" helperText="Separate with commas, e.g., React, WebDev, UX" value={formData.tags} onChange={(e) => setFormData({ tags: e.target.value })} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={3} maxRows={5} label="Author Bio" value={formData.authorBio} onChange={(e) => setFormData({ authorBio: e.target.value })} required />
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
