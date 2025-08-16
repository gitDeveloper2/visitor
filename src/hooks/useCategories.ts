import { useState, useEffect } from 'react';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  type: 'app' | 'blog' | 'both';
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  parentCategory?: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
  stats?: {
    appCount: number;
    blogCount: number;
    totalViews: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface UseCategoriesOptions {
  type?: 'app' | 'blog' | 'both';
  includeInactive?: boolean;
  parentCategory?: string;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { type, includeInactive = false, parentCategory } = options;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (includeInactive) params.append('isActive', 'false');
      if (parentCategory) params.append('parentCategory', parentCategory);

      const response = await fetch(`/api/categories?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Error fetching categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type, includeInactive, parentCategory]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
}

// Convenience hooks for specific category types
export function useAppCategories() {
  return useCategories({ type: 'app' });
}

export function useBlogCategories() {
  return useCategories({ type: 'blog' });
}

export function useAllCategories() {
  return useCategories({ type: 'both' });
}

// Hook for getting a single category by slug
export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/categories/${slug}`);
        const data = await response.json();

        if (data.success) {
          setCategory(data.data);
        } else {
          setError(data.error || 'Category not found');
        }
      } catch (err) {
        setError('Error fetching category');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error };
} 