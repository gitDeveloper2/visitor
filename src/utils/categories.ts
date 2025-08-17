// Categories utility - Fully API-driven to ensure consistency with database management
// All categories are now fetched from the database via /api/categories

import { isBuildTime, getBaseUrl } from '@/lib/config/environment';

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

// Subcategory suggestions organized by main category
export const subcategorySuggestions = {
  // Technology & Development
  "Technology": [
    "React", "Vue", "Angular", "Node.js", "Python", "JavaScript", "TypeScript",
    "Web Development", "Mobile Development", "UI/UX", "Design Systems",
    "API", "Database", "Cloud", "AWS", "Azure", "Docker", "Kubernetes"
  ],
  
  // Business & Marketing
  "Business": [
    "Startup", "SaaS", "B2B", "B2C", "Enterprise", "Freemium", "Paid", "Free",
    "Marketing", "SEO", "Analytics", "Automation", "Collaboration"
  ],
  
  // Content & Education
  "Education": [
    "Tutorial", "Guide", "Course", "Workshop", "Documentation", "Best Practices",
    "Case Study", "Interview", "Review", "News", "Opinion"
  ],
  
  // Creative & Design
  "Design": [
    "UI/UX", "Graphic Design", "Web Design", "Mobile Design", "Branding",
    "Typography", "Color Theory", "Layout", "Prototyping"
  ],
  
  // Emerging Technologies
  "AI": [
    "Machine Learning", "Deep Learning", "Natural Language Processing",
    "Computer Vision", "ChatGPT", "Generative AI", "Neural Networks"
  ],
  
  // Finance & Productivity
  "Finance": [
    "Personal Finance", "Investment", "Cryptocurrency", "Blockchain", "Web3",
    "Fintech", "Banking", "Insurance"
  ],
  
  // Health & Wellness
  "Health": [
    "Fitness", "Mental Health", "Nutrition", "Medical", "Wellness",
    "Healthcare", "Telemedicine", "Wearables"
  ],
  
  // Entertainment & Media
  "Entertainment": [
    "Gaming", "Music", "Video", "Streaming", "Social Media", "Content Creation",
    "Podcasting", "Blogging"
  ]
};

// Helper function to get subcategory suggestions for a main category
export const getSubcategorySuggestions = async (mainCategory: string): Promise<string[]> => {
  try {
    // Try to find the category ID first
    const categories = await fetchCategoriesFromAPI();
    const category = categories.find(cat => cat.name === mainCategory);
    
    if (category && category._id) {
      // Fetch subcategories from the database
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/categories?getSubcategories=true&parentCategory=${category._id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return data.data.map((subcat: any) => subcat.name);
        }
      }
    }
    
    // Fallback to hardcoded suggestions if database fetch fails
    return subcategorySuggestions[mainCategory as keyof typeof subcategorySuggestions] || [];
  } catch (error) {
    console.error('Error fetching subcategories from database:', error);
    // Fallback to hardcoded suggestions
    return subcategorySuggestions[mainCategory as keyof typeof subcategorySuggestions] || [];
  }
};

// Helper function to get all available subcategories from database
export const getAllSubcategoriesFromDB = async (): Promise<string[]> => {
  try {
    const categories = await fetchCategoriesFromAPI();
    const allSubcategories: string[] = [];
    
    // Fetch subcategories for each category
    for (const category of categories) {
      if (category._id) {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/categories?getSubcategories=true&parentCategory=${category._id}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            allSubcategories.push(...data.data.map((subcat: any) => subcat.name));
          }
        }
      }
    }
    
    return [...new Set(allSubcategories)]; // Remove duplicates
  } catch (error) {
    console.error('Error fetching all subcategories from database:', error);
    // Fallback to hardcoded suggestions
    return Object.values(subcategorySuggestions).flat();
  }
};

// Primary function to fetch categories from API
export const fetchCategoriesFromAPI = async (type?: 'app' | 'blog' | 'both'): Promise<Category[]> => {
  try {
    // During build time, return fallback categories to prevent build failures
    if (isBuildTime()) {
      console.log('Build time detected, returning fallback categories');
      return emergencyFallbackCategories[type || 'both'].map((name, index) => ({
        _id: `fallback-${index}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        type: type || 'both',
        isActive: true,
        sortOrder: index,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }

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
    // Return emergency fallbacks in case of any error
    return emergencyFallbackCategories[type || 'both'].map((name, index) => ({
      _id: `fallback-${index}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      type: type || 'both',
      isActive: true,
      sortOrder: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
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