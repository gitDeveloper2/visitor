// app/dashboard/blogs/create/BlogFormProvider.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { blogFormSchema, BlogFormType } from '../schema/schema';

const defaultValues: Partial<BlogFormType> = {
  title: '',
  content: "",
  excerpt: '',
  tags: [],
  featured: false,
  paidFeature: false,
  status:'draft' ,
  
};

export function BlogFormProvider({ children }: { children: React.ReactNode }) {
  const form = useForm<BlogFormType>({
    resolver: zodResolver(blogFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

// Optional convenience hook
export const useBlogForm = () => useContext(FormProvider as any);
