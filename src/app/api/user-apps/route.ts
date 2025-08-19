import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { kvDelByPrefix } from '@/features/shared/cache/kv';
import { Cache, CachePolicy } from '@/features/shared/cache';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { getCheckoutUrl, VARIANT_IDS } from '@lib/lemonsqueezy';
import { verifyAppPremiumStatus, revokeInvalidPremiumStatus } from '../../../utils/premiumVerification';

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
      subcategories, 
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
    const processedSubcategories = Array.isArray(subcategories) ? subcategories : [];
    const processedTechStack = Array.isArray(techStack) ? techStack : [];
    const processedFeatures = Array.isArray(features) ? features : [];
    
    // Determine if verification is required (free apps only)
    const isFreeApp = pricing === 'Free' || pricing === 'free' || !pricing;
    const requiresVerification = isFreeApp;
    const verificationStatus = requiresVerification ? 'pending' : 'not_required';

    const newApp = {
      name,
      description,
      tagline: tagline || description.slice(0, 100), // Use description as fallback
      fullDescription: fullDescription || description, // Use description as fallback
      subcategories: processedSubcategories,
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
      // SECURITY FIX: Premium status is NEVER set during creation
      // Only webhook verification can set isPremium: true
      premiumPlan: premiumPlan || null,
      isPremium: false, // 🛡️ SECURITY: Always false during creation
      premiumStatus: 'pending', // 🛡️ SECURITY: Pending until payment verified
      premiumRequestedAt: premiumPlan === 'premium' ? new Date() : null, // 🛡️ Track when premium was requested
      // Verification fields for free apps
      requiresVerification,
      verificationStatus,
      verificationAttempts: 0,
    };
    
    console.log('💾 Inserting new app:', newApp);
    
    const result = await db.collection('userapps').insertOne(newApp);
    
    const responseMessage = premiumPlan === 'premium' 
      ? 'App submitted successfully. Premium status will be activated after payment verification.' 
      : 'App submitted successfully.';

    try {
      revalidateTag('launch:list');
      if (newApp.category) revalidateTag(`launch:category:${newApp.category}`);
      revalidateTag(`app:${result.insertedId.toString()}`);
      revalidatePath('/launch');
      // KV invalidation
      kvDelByPrefix('launch:index:');
      kvDelByPrefix(`app:v1:${result.insertedId.toString()}`);
      if (newApp.category) kvDelByPrefix(`launch:category:v1:${String(newApp.category).toLowerCase().replace(/\s+/g, '-')}`);
      // v2 keys (new cache)
      kvDelByPrefix(Cache.keys.launchIndex);
      if (newApp.category) kvDelByPrefix(Cache.keys.launchCategory(String(newApp.category).toLowerCase().replace(/\s+/g, '-')));
      kvDelByPrefix(Cache.keys.appDetail(result.insertedId.toString()));
      // API per-user list caches
      kvDelByPrefix(`api:userapps:list:v1:${session.user.id}`);
    } catch {}

    return NextResponse.json(
      { 
        message: responseMessage,
        app: { _id: result.insertedId, ...newApp },
        premiumPlan,
        requiresPayment: premiumPlan === 'premium',
        // 🛡️ SECURITY: Clear messaging about premium status
        premiumStatus: 'pending'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'App submission failed.', error: error?.toString() }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    console.log("🚀 User apps API called");
    
    // Get session to ensure user is authenticated
    const session = await getSession();
    if (!session?.user) {
      console.warn("❌ No authenticated user found");
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }
    
    console.log("👤 Authenticated user:", { id: session.user.id, name: session.user.name, email: session.user.email });
    
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 15000);
    });
    
    const dbPromise = connectToDatabase();
    
    const { db } = await Promise.race([dbPromise, timeoutPromise]);
    
    console.log("💾 Connected DB:", db.databaseName);
    console.log("🔗 Database connection string:", process.env.MONGODB_URI?.split('@')[1] || 'hidden');
    
    // Test if we can actually query the database
    try {
      const collections = await db.listCollections().toArray();
      console.log("📚 Collections:", collections.map(col => col.name));
      
      if (!collections.some(col => col.name === 'userapps')) {
        console.log("⚠️ userapps collection not found, creating it...");
        await db.createCollection('userapps');
      }
      
      const firstDoc = await db.collection('userapps').findOne({});
      console.log("🔍 First doc in userapps:", firstDoc);
    } catch (dbError: any) {
      console.error("❌ Database query test failed:", dbError);
      throw new Error(`Database query failed: ${dbError.message}`);
    }

    const url = new URL(request.url);

    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const category = url.searchParams.get('category');
    const subcategory = url.searchParams.get('subcategory');
    const approved = url.searchParams.get('approved');
    const featured = url.searchParams.get('featured');
    const pricing = url.searchParams.get('pricing');
    const verificationStatus = url.searchParams.get('verificationStatus');
    const requiresVerification = url.searchParams.get('requiresVerification');

    // Log incoming query params
    console.log("🔍 Query Params:", {
      status,
      authorId,
      limit,
      page,
      category,
      subcategory,
      approved,
      featured,
      pricing,
      verificationStatus,
      requiresVerification
    });

    const filter: any = {};
    
    // CRITICAL: Always filter by the current user's ID for security
    filter.authorId = session.user.id;
    console.log("🔒 Filtering apps for user:", session.user.id);
    
    if (status) filter.status = status;
    if (authorId) filter.authorId = authorId; // This will override the above, but should be the same user
    if (category) filter.category = category;
    if (subcategory) filter.subcategories = { $in: [subcategory] };
    if (approved === 'true') filter.status = 'approved';
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (requiresVerification === 'true') filter.requiresVerification = true;
    
    // Handle featured apps (premium apps) - ONLY if they have valid payment records
    if (featured === 'true') {
      filter.status = 'approved';
      // We'll filter premium apps after verifying payment records
    }
    
    // Handle pricing filters
    if (pricing) {
      if (pricing === 'Premium') {
        // We'll filter premium apps after verifying payment records
      } else if (pricing === 'Free') {
        filter.isPremium = { $ne: true };
      }
      // Freemium apps can be either premium or free
    }

    // Log final filter before query
    console.log("🗂️ MongoDB Filter:", JSON.stringify(filter, null, 2));

    const skip = (page - 1) * limit;

    // Sort featured apps first, then by creation date
    const sortOptions: any = {};
    if (featured === 'true') {
      sortOptions.isPremium = -1; // Premium apps first
    }
    sortOptions.createdAt = -1; // Then by creation date

    let apps = await db
      .collection('userapps')
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log(`📦 Retrieved ${apps.length} apps before payment verification`);
    console.log("🔍 Apps verification status:", apps.map(app => ({
      name: app.name,
      verificationStatus: app.verificationStatus,
      verificationScore: app.verificationScore,
      authorId: app.authorId
    })));

    // CRITICAL: Verify premium status against actual payment records
    if (featured === 'true' || pricing === 'Premium') {
      console.log("🔒 Verifying premium status against payment records...");
      
      const verifiedApps = [];
      for (const app of apps) {
        if (app.isPremium) {
          // Check if there's a valid payment record
          const verification = await verifyAppPremiumStatus(db, app._id, app.authorId);
          if (verification.isValid) {
            verifiedApps.push(app);
          } else {
            console.log(`⚠️ App ${app._id} marked as premium but no valid payment found - removing premium status`);
            // Remove premium status from apps without valid payments
            await revokeInvalidPremiumStatus(db, app._id, verification.reason || 'No valid payment record found');
          }
        } else {
          verifiedApps.push(app);
        }
      }
      
      apps = verifiedApps;
      console.log(`✅ After payment verification: ${apps.length} apps remain`);
    }

    const queryIdentity = Cache.hash.hashObject({ status, authorId: filter.authorId, category, subcategory, approved, featured, pricing, verificationStatus, requiresVerification, limit, page, sortOptions });
    const cacheKey = Cache.keys.apiUserAppsList(session.user.id as string, queryIdentity);

    const payload = await Cache.getOrSet(
      cacheKey,
      CachePolicy.api.userAppsList,
      async () => {
        const totalCount = await db.collection('userapps').countDocuments(filter);
        console.log(`📊 Total Count: ${totalCount}`);
        return {
          apps,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
          }
        };
      }
    );

    const response = NextResponse.json(payload, { status: 200 });
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error: any) {
    console.error("❌ Error fetching apps:", error);
    
    // Return a more helpful error message
    let errorMessage = 'Failed to fetch apps.';
    if (error.message?.includes('timeout')) {
      errorMessage = 'Database connection timeout. Please try again.';
    } else if (error.message?.includes('Database query failed')) {
      errorMessage = 'Database query failed. Please check your connection.';
    }
    
    return NextResponse.json({ 
      message: errorMessage, 
      error: error?.toString(),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

