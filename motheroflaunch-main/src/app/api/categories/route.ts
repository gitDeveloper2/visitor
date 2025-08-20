// /app/api/categories/route.ts
import { NextResponse } from 'next/server';
import Category from '@features/tools/models/Category';
import { connectToMongo } from '@features/shared/lib/mongoose';
import slugify from 'slugify';
import { createCategorySchema } from '@features/categories/schemas/categorySchema';

export async function GET() {
  await connectToMongo();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  await connectToMongo();

  try {
    const body = await req.json();

    // ✅ Validate input
    const parsed = createCategorySchema.parse(body);

    // ✅ Generate slug from name
    const slug = slugify(parsed.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // ✅ Check for duplicates
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists.' }, { status: 409 });
    }

    // ✅ Save to DB
    const category = await Category.create({ ...parsed, slug });

    return NextResponse.json({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      color: category.color,
      description: category.description,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
