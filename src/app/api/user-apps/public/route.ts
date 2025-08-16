import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/mongodb';

// Public endpoint to fetch approved user apps for the /launch pages
export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const tag = url.searchParams.get('tag');
    const category = url.searchParams.get('category');
    const pricing = url.searchParams.get('pricing'); // Free | Freemium | Premium

    const filter: any = { status: 'approved' };

    if (tag) filter.tags = { $in: [tag] };
    if (category) filter.category = category;

    // Pricing filter logic
    if (pricing === 'Premium') {
      filter.isPremium = true;
    } else if (pricing === 'Free') {
      filter.isPremium = { $ne: true };
      filter.$or = [
        { pricing: { $exists: false } },
        { pricing: 'Free' },
        { pricing: 'free' },
      ];
    } else if (pricing === 'Freemium') {
      filter.$or = [
        { pricing: 'Freemium' },
        { pricing: 'freemium' },
      ];
    }

    const skip = (page - 1) * limit;

    const apps = await db
      .collection('userapps')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db.collection('userapps').countDocuments(filter);

    return NextResponse.json({
      apps,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public apps:', error);
    return NextResponse.json({ message: 'Failed to fetch apps.', error: (error as any)?.toString() }, { status: 500 });
  }
}

