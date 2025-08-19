import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { kvDelByPrefix } from '@/features/shared/cache/kv';
import { Cache, CachePolicy } from '@/features/shared/cache';
import { getSession } from '@/features/shared/utils/auth';
import { connectToDatabase } from '@lib/mongodb';
import { generateUniqueSlug } from '../../../utils/slugGenerator';
import { computeBlogQuality, finalizeBlogQualityScore } from '@/features/ranking/quality';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { 
      title, 
      content, 
      category,
      subcategories, 
      tags,
      isInternal,
      author, // from form
      role, // from form
      authorBio, // from form
      excerpt,
      founderUrl, // from form
      isFounderStory, // from form
      imageUrl, // from image upload
      imagePublicId // from image upload
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Premium check is now handled in the frontend with draft support
    // Users can only reach this point if they have premium access or it's a founder story
    if (!isFounderStory) {
      // Double-check premium access on the backend for security
      const activeSub = await db.collection('blog_premium_access').findOne({
        userId: session.user.id,
        status: 'active',
        expiresAt: { $gt: new Date() },
      });
      
      if (!activeSub) {
        return NextResponse.json(
          { message: 'Premium subscription required to submit non-Founder Story blogs.' },
          { status: 402 }
        );
      }
    }

    // Generate a unique slug for the blog
    const existingSlugs = await db
      .collection('userblogs')
      .find({}, { projection: { slug: 1 } })
      .toArray();
    
    const existingSlugStrings = existingSlugs.map(blog => blog.slug);
    const slug = generateUniqueSlug(title, existingSlugStrings);

    // Compute quality score once per create
    const qualityParts = computeBlogQuality(content);
    const quality = finalizeBlogQualityScore({
      wordCount: qualityParts.wordCount,
      headingsScore: qualityParts.headingsScore,
      linksScore: qualityParts.linksScore,
      hasImage: Boolean(imageUrl),
      tagsCount: Array.isArray(tags) ? tags.length : 0,
    });

    const newBlog = {
      title,
      slug, // Add the generated slug
      content,
      category: category || 'Technology',
      subcategories: subcategories || [],
      tags: Array.isArray(tags) ? tags : [],
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      // Additional fields from form
      author: author || session.user.name,
      role: role || 'Author',
      authorBio: authorBio || '',
      excerpt: excerpt || '',
      founderUrl: founderUrl || '',
      isFounderStory: isFounderStory || false,
      isInternal: isInternal || isFounderStory || false,
      // Image fields
      imageUrl: imageUrl || '',
      imagePublicId: imagePublicId || '',
      // Metadata for display
      readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200), // ~200 words per minute
      views: 0,
      likes: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      qualityScore: quality.total,
      qualityBreakdown: quality,
    };

    const result = await db.collection('userblogs').insertOne(newBlog);

    try {
      revalidateTag('blog:list');
      revalidateTag(`blog:post:${result.insertedId.toString()}`);
      if (newBlog.category) revalidateTag(`blog:category:${newBlog.category}`);
      if (Array.isArray(newBlog.tags)) newBlog.tags.forEach((t: string) => revalidateTag(`blog:tag:${t}`));
      revalidatePath('/blogs');
      revalidatePath(`/blogs/${newBlog.slug}`);
      if (newBlog.category) {
        const catSlug = String(newBlog.category).toLowerCase().replace(/\s+/g, '-');
        revalidatePath(`/blogs/category/${catSlug}`);
      }
      // KV invalidation
      kvDelByPrefix('blog:index:');
      kvDelByPrefix(`blog:post:v1:${newBlog.slug}`);
      if (newBlog.category) kvDelByPrefix(`blog:category:v1:${String(newBlog.category).toLowerCase().replace(/\s+/g, '-')}`);
      if (Array.isArray(newBlog.tags)) newBlog.tags.forEach((t: string) => kvDelByPrefix(`blog:tag:v1:${t}`));
      // v2 keys (new cache)
      kvDelByPrefix(Cache.keys.blogPost(newBlog.slug));
      kvDelByPrefix(Cache.keys.blogsIndex);
      if (newBlog.category) kvDelByPrefix(Cache.keys.blogsCategory(String(newBlog.category).toLowerCase().replace(/\s+/g, '-')));
      if (Array.isArray(newBlog.tags)) newBlog.tags.forEach((t: string) => kvDelByPrefix(Cache.keys.blogsTag(t)));
      // API per-user list caches
      kvDelByPrefix(`api:userblogs:list:v1:${session.user.id}`);
    } catch {}

    return NextResponse.json(
      { message: 'Blog submitted successfully.', blog: { _id: result.insertedId, ...newBlog } },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Blog submission failed.', error: error?.toString() }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthenticated User' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const category = url.searchParams.get('category');
    const subcategory = url.searchParams.get('subcategory');
    const approved = url.searchParams.get('approved');

    const filter: any = {};
    
    // If no specific authorId is provided, filter by current user
    if (authorId) {
      filter.authorId = authorId;
    } else if (approved !== 'true') {
      // Only show user's own blogs unless specifically requesting approved blogs
      filter.authorId = session.user.id;
    }
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (subcategory) filter.subcategories = { $in: [subcategory] };
    if (approved === 'true') filter.status = 'approved';

    const skip = (page - 1) * limit;

    const blogs = await db
      .collection('userblogs')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Cache GET list response briefly to reduce redundant DB hits per user+query
    const userId = session.user.id as string;
    const queryIdentity = Cache.hash.hashObject({ status, authorId: filter.authorId, category, subcategory, approved, limit, page });
    const cacheKey = Cache.keys.apiUserBlogsList(userId, queryIdentity);

    const responsePayload = await Cache.getOrSet(
      cacheKey,
      CachePolicy.api.userBlogsList,
      async () => {
        const totalCount = await db.collection('userblogs').countDocuments(filter);
        return {
          blogs,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
          }
        };
      }
    );

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch blogs.', error: (error as any)?.toString?.() }, { status: 500 });
  }
}
