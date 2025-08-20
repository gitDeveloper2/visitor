// app/dashboard/blogs/create/steps/StepBasics.tsx
'use client';

import { Box, Button, TextField, Chip, Stack } from '@mui/material';
import { useFormContext} from 'react-hook-form';
import { useState } from 'react';

export default function StepBasics({ onNext }: { onNext: () => void }) {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();
  const [tagInput, setTagInput] = useState('');
  const tags = watch('tags') || [];

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setValue('tags', [...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack spacing={3}>
        <TextField
          label="Title"
          {...register('title')}
          error={!!errors.title}
          helperText={typeof errors.title?.message === 'string' ? errors.title.message : undefined}
          fullWidth
        />

      

        <Stack direction="row" spacing={1}>
          <TextField
            label="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button variant="outlined" onClick={addTag}>Add</Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              onDelete={() => removeTag(tag)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" onClick={onNext}>Next</Button>
        </Box>
      </Stack>
    </Box>
  );
}
