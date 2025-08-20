// app/dashboard/blogs/create/steps/StepMetadata.tsx
'use client';

import { Box, Button, TextField, Checkbox, FormControlLabel, Typography, Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';

export default function StepMetadata({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const coverImage = watch('coverImage');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload to Cloudinary or use your helper
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_unsigned_preset');

    const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setValue('coverImage', { url: data.secure_url, public_id: data.public_id });
  };

  return (
    <Stack spacing={3}>
   <TextField
  label="Excerpt"
  {...register('excerpt')}
  error={!!errors.excerpt}
  helperText={errors.excerpt?.message as string}
  fullWidth
/>


      <div>
        <Typography variant="subtitle1" gutterBottom>
          Cover Image
        </Typography>
        {coverImage?.url && (
          <Image
            src={coverImage.url}
            alt="Cover"
            width={400}
            height={200}
            style={{ objectFit: 'cover', marginBottom: '1rem', borderRadius: 8 }}
          />
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <FormControlLabel
        control={<Checkbox {...register('featured')} />}
        label="Mark as Featured"
      />

      <FormControlLabel
        control={<Checkbox {...register('paidFeature')} />}
        label="Paid Feature"
      />

<FormControlLabel
  control={
    <Checkbox
      checked={watch('status') === 'published'}
      onChange={(e) => setValue('status', e.target.checked ? 'published' : 'draft')}
    />
  }
  label="Published"
/>


      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext}>Next</Button>
      </Box>
    </Stack>
  );
}
