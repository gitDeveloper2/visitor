// app/categories/@sidebar/page.tsx
import { listCategories } from '@features/tools/service/categoryService';
import CategoriesLayoutClient from '@features/tools/components/CategoriesLayoutClient';

export default async function Sidebar() {
  const categories = await listCategories();
  return <CategoriesLayoutClient categories={categories} />;
}
