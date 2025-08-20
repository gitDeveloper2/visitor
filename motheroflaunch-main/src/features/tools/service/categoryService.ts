import { Types } from 'mongoose';
import slugify from 'slugify';
import Category, { ICategory } from '../models/Category';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

const CATEGORY_TAG = 'categories';
const CATEGORY_PAGES = ['/', '/categories'];

// ✅ Shared helper to invalidate both tag + paths
async function revalidateCategoriesEverywhere() {
  await revalidateTag(CATEGORY_TAG);
  for (const path of CATEGORY_PAGES) {
    await revalidatePath(path);
  }
}

// ✅ Cached function to get all categories
export const listCategories = unstable_cache(
  async function fetchCategories() {
    const categories = await Category.find().sort({ name: 1 }).lean();
    return categories as unknown as ICategory[];
  },
  [], // cache key args (none)
  {
    tags: [CATEGORY_TAG],
  }
);

// 🔍 Get category by ID (no caching)
export async function getCategoryById(id: string | Types.ObjectId) {
  return await Category.findById(id).lean();
}

// 🔍 Get category by slug (no caching)
export async function getCategoryBySlug(slug: string) {
  return await Category.findOne({ slug }).lean();
}

// ➕ Create a new category and invalidate everything
export async function createCategory(name: string, description?: string) {
  const slug = slugify(name, { lower: true, strict: true });

  const existing = await Category.findOne({ slug });
  if (existing) return existing;

  const category = await Category.create({ name, slug, description });

  await revalidateCategoriesEverywhere(); // 🚨 invalidate tag + pages

  return category;
}

// ✏️ Update category and invalidate everything
export async function updateCategory(
  id: string,
  updates: Partial<Pick<ICategory, 'name' | 'slug' | 'description'>>
): Promise<ICategory | null> {
  const updated = await Category.findByIdAndUpdate(id, updates, { new: true });

  await revalidateCategoriesEverywhere(); // 🚨 invalidate tag + pages

  return updated;
}

// ❌ Delete category and invalidate everything
export async function deleteCategory(id: string): Promise<void> {
  await Category.findByIdAndDelete(id);

  await revalidateCategoriesEverywhere(); // 🚨 invalidate tag + pages
}
