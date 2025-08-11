import { NextResponse } from 'next/server';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { getCheckoutUrl, VARIANT_IDS } from '@lib/lemonsqueezy';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }
    
    const requestBody = await request.json();
    console.log('📝 Received app submission:', requestBody);
    console.log('👤 User session:', { id: session.user.id, name: session.user.name, email: session.user.email });
    
    const { 
      name, 
      description, 
      tags, 
      isInternal,
      // Additional fields for better app data
      website,
      github,
      category,
      techStack,
      pricing,
      features,
      // New fields for better presentation
      tagline,
      fullDescription,
      authorBio,
      premiumPlan
    } = requestBody;
    
    if (!name || !description) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!description) missingFields.push('description');
      return NextResponse.json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Check if the collection exists, if not create it
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    console.log('📚 Available collections:', collectionNames);
    
    if (!collectionNames.includes('userapps')) {
      console.log('⚠️ userapps collection not found, creating it...');
      await db.createCollection('userapps');
    }
    
    // Generate a unique slug from the name
    let slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check if slug already exists and make it unique
    let counter = 1;
    let originalSlug = slug;
    while (await db.collection('userapps').findOne({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    
    // Ensure arrays are properly formatted (no more comma-separated string handling)
    const processedTags = Array.isArray(tags) ? tags : [];
    const processedTechStack = Array.isArray(techStack) ? techStack : [];
    const processedFeatures = Array.isArray(features) ? features : [];
    
    const newApp = {
      name,
      description,
      tagline: tagline || description.slice(0, 100), // Use description as fallback
      fullDescription: fullDescription || description, // Use description as fallback
      tags: processedTags,
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      authorBio: authorBio || '',
      authorAvatar: session.user.image || null,
      isInternal: !!isInternal,
      // Additional metadata
      website: website || '',
      github: github || '',
      category: category || 'Other',
      techStack: processedTechStack,
      pricing: pricing || 'Free',
      features: processedFeatures,
      // URL and slug
      slug,
      externalUrl: website || null,
      // Display metadata
      views: 0,
      likes: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Premium status
      premiumPlan: premiumPlan || null,
      isPremium: premiumPlan === 'premium',
    };
    
    console.log('💾 Inserting new app:', newApp);
    
    const result = await db.collection('userapps').insertOne(newApp);
    
    // If premium was selected, generate checkout URL
    let checkoutUrl = null;
    if (premiumPlan === 'premium') {
      try {
        checkoutUrl = getCheckoutUrl(VARIANT_IDS.PREMIUM_APP_LISTING, {
          email: session.user.email,
          name: session.user.name,
          custom: {
            app_id: result.insertedId.toString(),
            app_name: name,
            subscription_type: "premium_app_listing",
          },
        });
      } catch (error) {
        console.error('Error generating checkout URL:', error);
      }
    }
    
    return NextResponse.json(
      { 
        message: 'App submitted successfully.', 
        app: { _id: result.insertedId, ...newApp },
        premiumPlan,
        checkoutUrl,
        requiresPayment: premiumPlan === 'premium'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'App submission failed.', error: error?.toString() }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase();
    console.log("💾 Connected DB:", db.databaseName);
console.log("📚 Collections:", await db.listCollections().toArray());
console.log("🔍 First doc in userapps:", await db.collection('userapps').findOne({}));

    const url = new URL(request.url);

    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const tag = url.searchParams.get('tag');
    const approved = url.searchParams.get('approved');

    // Log incoming query params
    console.log("🔍 Query Params:", {
      status,
      authorId,
      limit,
      page,
      tag,
      approved
    });

    const filter: any = {};
    
    if (status) filter.status = status;
    if (authorId) filter.authorId = authorId;
    if (tag) filter.tags = { $in: [tag] };
    if (approved === 'true') filter.status = 'approved';

    // Log final filter before query
    console.log("🗂️ MongoDB Filter:", JSON.stringify(filter, null, 2));

    const skip = (page - 1) * limit;

    const apps = await db
      .collection('userapps')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log(`📦 Retrieved ${apps.length} apps`);

    // Get total count for pagination
    const totalCount = await db.collection('userapps').countDocuments(filter);
    console.log(`📊 Total Count: ${totalCount}`);

    return NextResponse.json({ 
      apps,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching apps:", error);
    return NextResponse.json({ 
      message: 'Failed to fetch apps.', 
      error: error?.toString() 
    }, { status: 500 });
  }
}

