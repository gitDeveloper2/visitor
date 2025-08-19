import { connectToDatabase } from '../../../../lib/mongodb';
import { Cache, CachePolicy } from '@/features/shared/cache';
import Client, { BlogPost } from './Client';
export async function generateStaticParams() {
  try {
    const { db } = await (await import('../../../../lib/mongodb')).connectToDatabase();
    const recent = await db.collection('userblogs')
      .find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(50)
      .project({ slug: 1 })
      .toArray();
    return recent.map((b: any) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

// Align detail page to 24h as requested
export const revalidate = 86400;

export default async function Page({ params }: { params: { slug: string } }) {
  const { db } = await connectToDatabase();
  const blog = await Cache.getOrSet(
    Cache.keys.blogPost(params.slug),
    CachePolicy.page.blogPost,
    async () => {
      return await db.collection('userblogs').findOne({ slug: params.slug, status: 'approved' });
    }
  );
  if (!blog) {
    // Let not-found bubble up (Next will render 404)
    return null as any;
  }

  const transformed: BlogPost = {
    _id: blog._id.toString(),
    title: blog.title || '',
    slug: blog.slug || params.slug,
    content: blog.content || '',
    tags: blog.tags || [],
    authorName: blog.authorName || '',
    authorEmail: blog.authorEmail || '',
    author: blog.author || blog.authorName || '',
    role: blog.role || 'Author',
    authorBio: blog.authorBio || '',
    excerpt: blog.excerpt || '',
    imageUrl: blog.imageUrl || '',
    founderUrl: blog.founderUrl || '',
    isInternal: blog.isInternal || false,
    isFounderStory: blog.isFounderStory || false,
    readTime: blog.readTime || Math.ceil((blog.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200),
    status: blog.status || 'approved',
    createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
  };

  return <Client blog={transformed} />;
}