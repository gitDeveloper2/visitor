// app/dashboard/categories/create/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import {
  CreateCategoryInput,
  createCategorySchema,
} from '@features/categories/schemas/categorySchema';
import ColorField from '@features/categories/components/ColorGrid';
import { useCategoryById, useCreateCategory, useUpdateCategory } from '@features/categories/hooks/useToolsByCategory';


export default function CreateOrEditCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: '', color: '', description: '' },
  });

  const { setValue, reset } = form;

  const { data: existing, isLoading } = useCategoryById(id || '');
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  useEffect(() => {
    if (id && existing) {
      reset({
        name: existing.name,
        color: existing.color || '',
        description: existing.description || '',
      });
    }
  }, [id, existing, reset]);

  const onSubmit = async (data: CreateCategoryInput) => {
    try {
      if (id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      router.push('/dashboard/categories');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack spacing={2} maxWidth={400}>
          <Typography variant="h5">
            {id ? 'Edit Category' : 'Add New Category'}
          </Typography>

          {id && isLoading && <CircularProgress size={24} />}

          <TextField
            label="Name"
            {...form.register('name')}
            error={!!form.formState.errors.name}
            helperText={form.formState.errors.name?.message}
          />

          <TextField
            label="Description (optional)"
            {...form.register('description')}
            multiline
            minRows={3}
            error={!!form.formState.errors.description}
            helperText={form.formState.errors.description?.message}
          />

          <ColorField />

          <Button type="submit" variant="contained" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Saving...'
              : id
              ? 'Update Category'
              : 'Add Category'}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
