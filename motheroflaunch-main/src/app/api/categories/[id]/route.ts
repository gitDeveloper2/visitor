// /app/api/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import Category from '@features/tools/models/Category';
import { connectToMongo } from '@features/shared/lib/mongoose';
import { Types } from 'mongoose';
import { CreateCategoryInput, createCategorySchema } from '@features/categories/schemas/categorySchema';
import slugify from 'slugify';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToMongo();
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
  }

  try {
    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: {params: Promise<{ id: string }>  }) {
  await connectToMongo();
  const id = (await params).id;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = createCategorySchema.partial().parse(body) as Partial<CreateCategoryInput> & { slug?: string };

if (parsed.name) {
  parsed.slug = slugify(parsed.name, {
    lower: true,
    strict: true,
    trim: true,
  });
}


    const updated = await Category.findByIdAndUpdate(id, parsed, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToMongo();
  const id = (await params).id;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 });
  }
}
