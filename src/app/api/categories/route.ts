import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, isAdmin } from '@/lib/auth';
import categoryService from '@/lib/services/categoryService';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

// GET /api/categories - Get all categories with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'app' | 'blog' | 'both' | undefined;
    const isActive = searchParams.get('isActive') !== 'false'; // Default to true
    const parentCategory = searchParams.get('parentCategory') || undefined;

    const filters = {
      type,
      isActive,
      parentCategory
    };

    const categories = await categoryService.getCategories(filters);
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession();
    if (!session || !(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const category = await categoryService.createCategory(body);
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 