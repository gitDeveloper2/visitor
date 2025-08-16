import { Box, Checkbox, FormControl, Input, InputLabel, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Control, Controller, FieldErrors, useWatch, useFormContext } from 'react-hook-form';
import { AddPageProps, FormData } from './types';

const DomainFlagsSection: React.FC<AddPageProps> = ({ control, errors }) => {
  const { setValue } = useFormContext<FormData>();

  // Watch domain, slug, and news fields
  const domain = useWatch({ control, name: "domain" });
  const slug = useWatch({ control, name: "slug" });
  const isNews = useWatch({ control, name: "news" });

  // Auto-generate canonical URL when domain, slug, or news changes
  useEffect(() => {
    if (domain && slug) {
      const prefix = isNews ? "/news" : "/learn"; // Use "/news" or "/learn"
      const canonicalUrl = `${prefix}/${domain}/${slug}`;
      setValue("canonical_url", canonicalUrl, { shouldValidate: true });
    }
  }, [domain, slug, isNews, setValue]);

  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="domain">Domain</InputLabel>
        <Input
          id="domain"
          name="domain"
          {...control.register("domain", { required: "Domain is required" })}
          required
        />
        {errors.domain && (
          <Typography variant="body2" color="error">
            {errors.domain.message}
          </Typography>
        )}
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="slug">Slug</InputLabel>
        <Input
          id="slug"
          name="slug"
          {...control.register("slug", { required: "Slug is required" })}
          required
        />
        {errors.slug && (
          <Typography variant="body2" color="error">
            {errors.slug.message}
          </Typography>
        )}
      </FormControl>
<Box display='flex' flexDirection={'row'} gap={2}>
  
      <Controller
        name="isPublished"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Box display="flex" flexDirection={"row"} alignItems="center">
              <InputLabel shrink>{field.value ? "Published" : "Unpublished"}</InputLabel>
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            </Box>
            {errors.isPublished && (
              <Typography variant="body2" color="error">
                {errors.isPublished.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="news"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Box display="flex" flexDirection={"row"} alignItems="center">
              <InputLabel shrink>{field.value ? "News" : "Blog"}</InputLabel>
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            </Box>
            {errors.news && (
              <Typography variant="body2" color="error">
                {errors.news.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
</Box>
      <TextField
        id="canonical_url"
        name="canonical_url"
        label="Canonical URL"
        {...control.register("canonical_url")}
        fullWidth
        sx={{ mb: 2 }}
      />
    </>
  );
};

export default DomainFlagsSection;
