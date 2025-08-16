import { connectToDatabase } from '../mongodb';
import { serializeMongoObject } from '../utils/serialization';
import { ObjectId } from 'mongodb';

export interface ICategory {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryFilters {
  type?: 'app' | 'blog' | 'both';
  isActive?: boolean;
  parentCategory?: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  type: 'app' | 'blog' | 'both';
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  parentCategory?: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  isActive?: boolean;
}

class CategoryService {
  /**
   * Get all categories with optional filtering
   */
  async getCategories(filters: CategoryFilters = {}): Promise<ICategory[]> {
    try {
      const { db } = await connectToDatabase();
      
      const query: any = {};
      if (filters.type) query.type = filters.type;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.parentCategory) query.parentCategory = filters.parentCategory;

      const categories = await db.collection('categories')
        .find(query)
        .sort({ sortOrder: 1, name: 1 })
        .toArray();

      return serializeMongoObject(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Get categories by type (app, blog, or both)
   */
  async getCategoriesByType(type: 'app' | 'blog' | 'both'): Promise<ICategory[]> {
    return this.getCategories({ type, isActive: true });
  }

  /**
   * Get a single category by slug
   */
  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    try {
      const { db } = await connectToDatabase();
      
      const category = await db.collection('categories')
        .findOne({ slug, isActive: true });

      return category ? serializeMongoObject(category) : null;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw new Error('Failed to fetch category');
    }
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(id: string): Promise<ICategory | null> {
    try {
      const { db } = await connectToDatabase();
      
      const category = await db.collection('categories')
        .findOne({ _id: new ObjectId(id) });

      return category ? serializeMongoObject(category) : null;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw new Error('Failed to fetch category');
    }
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryData): Promise<ICategory> {
    try {
      const { db } = await connectToDatabase();
      
      const categoryData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        sortOrder: data.sortOrder || 0,
        stats: {
          appCount: 0,
          blogCount: 0,
          totalViews: 0
        }
      };
      
      const result = await db.collection('categories').insertOne(categoryData);
      const category = await db.collection('categories').findOne({ _id: result.insertedId });
      
      return serializeMongoObject(category);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, data: UpdateCategoryData): Promise<ICategory | null> {
    try {
      const { db } = await connectToDatabase();
      
      const updateData = {
        ...data,
        updatedAt: new Date()
      };
      
      const result = await db.collection('categories').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result ? serializeMongoObject(result) : null;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  /**
   * Delete a category (soft delete by setting isActive to false)
   */
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('categories').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isActive: false, 
            updatedAt: new Date() 
          } 
        }
      );

      return !!result;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  /**
   * Hard delete a category (use with caution)
   */
  async hardDeleteCategory(id: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      
      const result = await db.collection('categories').findOneAndDelete({ _id: new ObjectId(id) });
      return !!result;
    } catch (error) {
      console.error('Error hard deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  /**
   * Update category statistics
   */
  async updateCategoryStats(categoryId: string, type: 'app' | 'blog', count: number): Promise<void> {
    try {
      const { db } = await connectToDatabase();
      
      const updateField = type === 'app' ? 'stats.appCount' : 'stats.blogCount';
      await db.collection('categories').findOneAndUpdate(
        { _id: new ObjectId(categoryId) },
        { $set: { [updateField]: count } }
      );
    } catch (error) {
      console.error('Error updating category stats:', error);
    }
  }

  /**
   * Get category hierarchy (parent categories with subcategories)
   */
  async getCategoryHierarchy(): Promise<ICategory[]> {
    try {
      const { db } = await connectToDatabase();
      
      const categories = await db.collection('categories')
        .find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .toArray();

      // For now, return all active categories since we're not doing complex population
      // In a real implementation, you might want to do additional queries for subcategories
      return serializeMongoObject(categories);
    } catch (error) {
      console.error('Error fetching category hierarchy:', error);
      throw new Error('Failed to fetch category hierarchy');
    }
  }

  /**
   * Search categories by name or description
   */
  async searchCategories(query: string, type?: 'app' | 'blog' | 'both'): Promise<ICategory[]> {
    try {
      const { db } = await connectToDatabase();
      
      const searchQuery: any = {
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };

      if (type) searchQuery.type = type;

      const categories = await db.collection('categories')
        .find(searchQuery)
        .sort({ sortOrder: 1, name: 1 })
        .limit(20)
        .toArray();

      return serializeMongoObject(categories);
    } catch (error) {
      console.error('Error searching categories:', error);
      throw new Error('Failed to search categories');
    }
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService; 