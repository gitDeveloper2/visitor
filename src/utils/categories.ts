// Categories utility - Fully API-driven to ensure consistency with database management
// All categories are now fetched from the database via /api/categories

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

// Minimal fallback categories for emergency use only
const emergencyFallbackCategories = {
  app: ["Productivity", "Development", "Design", "Marketing", "Analytics"],
  blog: ["Technology", "Business", "Development", "Design", "Marketing"],
  both: ["Technology", "Productivity", "Development", "Design", "Marketing"]
};

// Tags remain static as they are different from categories
export const blogTags = [
  "React", "Vue", "Angular", "Node.js", "Python", "JavaScript", "TypeScript",
  "Web Development", "Mobile Development", "UI/UX", "Design Systems",
  "Startup", "Business", "Marketing", "SEO", "Analytics", "Productivity",
  "AI", "Machine Learning", "Web3", "Blockchain", "Tutorial", "Guide",
  "Case Study", "Interview", "Tools", "Resources"
] as const;

export const appTags = [
  "React", "Vue", "Angular", "Node.js", "Python", "JavaScript", "TypeScript",
  "Mobile", "Desktop", "Web App", "API", "Database", "Cloud", "AWS", "Azure",
  "Free", "Freemium", "Paid", "Open Source", "SaaS", "B2B", "B2C", "AI",
  "Analytics", "Automation", "Collaboration", "Communication", "Design",
  "Development", "Education", "Entertainment", "Finance", "Health",
  "Marketing", "Productivity", "Security", "Social Media"
] as const;

export type BlogTag = typeof blogTags[number];
export type AppTag = typeof appTags[number];

// Helper function to get the base URL for API calls
const getBaseUrl = () => {
  // Check if we're on the server side
  if (typeof window === 'undefined') {
    // Server-side: always use localhost in development
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    
    // Production: use environment variable or default
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://basicutils.com';
  }
  // Client-side: use relative URL
  return '';
};

// Primary function to fetch categories from API
export const fetchCategoriesFromAPI = async (type?: 'app' | 'blog' | 'both'): Promise<Category[]> => {
  try {
    const baseUrl = getBaseUrl();
    const params = new URLSearchParams();
    if (type) {
      params.append('type', type);
    }
    params.append('isActive', 'true'); // Only fetch active categories
    
    const url = `${baseUrl}/api/categories?${params.toString()}`;
    
    // Debug logging
    console.log('Fetching categories from:', url);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Base URL:', baseUrl);
    
    // Validate URL before making the request
    if (!url.startsWith('http') && !url.startsWith('/')) {
      throw new Error(`Invalid URL: ${url}`);
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to fetch categories:', data.error);
      throw new Error(data.error || 'Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Convenience function to get just category names
export const fetchCategoryNames = async (type?: 'app' | 'blog' | 'both'): Promise<string[]> => {
  try {
    const categories = await fetchCategoriesFromAPI(type);
    return categories.map(cat => cat.name);
  } catch (error) {
    console.error('Error fetching category names:', error);
    // Return emergency fallbacks only in case of complete API failure
    return emergencyFallbackCategories[type || 'both'];
  }
};

// Function to get categories for navigation (with paths)
export const fetchCategoriesForNavigation = async (): Promise<Array<{
  name: string;
  path: string;
  subcategories?: Array<{ name: string; path: string }>;
}>> => {
  try {
    const categories = await fetchCategoriesFromAPI('both');
    
    return categories.map(category => ({
      name: category.name,
      path: `/categories/${category.slug}`,
      // Note: Subcategories would need to be implemented in the database model
      // For now, we'll return empty subcategories
      subcategories: []
    }));
  } catch (error) {
    console.error('Error fetching categories for navigation:', error);
    // Return minimal fallback for navigation
    return [
      { name: "Technology", path: "/categories/technology", subcategories: [] },
      { name: "Development", path: "/categories/development", subcategories: [] },
      { name: "Design", path: "/categories/design", subcategories: [] }
    ];
  }
};

// Legacy type exports for backward compatibility
export type BlogCategory = string; // Now dynamic from API
export type AppCategory = string; // Now dynamic from API 