import mongoose from 'mongoose';
import Blog, { BlogWithAuthor } from '../models/model';
import { connectToMongo } from '@features/shared/lib/mongoose';
import { blogAPISchema, BlogAPIType, BlogFormType } from '../schema/schema';
import slugify from 'slugify';
import { formToApiBlog, partialFormToApiPatch } from '../transformers/transformers';
import { serializeBlog } from '../utils/transformers';

// === Utility ===
export async function generateUniqueSlug(title: string): Promise<string> {

  await connectToMongo();

  const base = slugify(title, {
    lower: true,
    strict: true,       // remove symbols like %, &, !
    replacement: '-',   // default
  });
  let slug = base;
  let counter = 1;

  while (await Blog.exists({ slug })) {
    slug = `${base}-${counter++}`;
  }

  return slug;
}

// === CRUD ===

export async function createBlog(data: BlogFormType, userId: string) {
  await connectToMongo();
  const slug = await generateUniqueSlug(data.title!);
  const blog = formToApiBlog(data, userId, slug);
  console.log(blog)
  const validated = blogAPISchema.parse(blog);
  return Blog.create(validated);
}

export async function updateBlog(blogId: string, data: BlogFormType) {
  await connectToMongo();
  const partialData=partialFormToApiPatch(data)
  const validatedData = blogAPISchema.partial().parse(partialData);

  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error('Blog not found');

  blog.set(validatedData);
  return blog.save({ validateModifiedOnly: true });

}


export async function deleteBlog(blogId: string) {
  await connectToMongo();
  return Blog.findByIdAndDelete(blogId);
}

// === Draft & Publishing ===

export async function startEditingBlog(originalId: string, authorId: string) {
  await connectToMongo();

  const original = await Blog.findOne({ _id: originalId, status: 'published' });
  if (!original) throw new Error('Original blog not found');

  const existingDraft = await Blog.findOne({
    originalBlogId: original._id,
    author: authorId,
    status: 'draft',
  });

  if (existingDraft) return existingDraft;

  const slug = await generateUniqueSlug(original.title);

  const draft = await Blog.create({
    title: original.title,
    slug,
    content: original.content,
    excerpt: original.excerpt,
    coverImage: original.coverImage,
    tags: original.tags,
    author: original.author,
    tool: original.tool,
    featured: original.featured,
    paidFeature: original.paidFeature,
    suspended: original.suspended,
    status: 'draft',
    originalBlogId: original._id,
    step: 2,
  });

  return draft;
}

export async function publishBlog(blogId: string) {
  await connectToMongo();

  const draft = await Blog.findOne({ _id: blogId, status: 'draft' });
  if (!draft) throw new Error('Draft not found');

  if (draft.originalBlogId) {
    await Blog.findByIdAndUpdate(
      draft.originalBlogId,
      {
        title: draft.title,
        slug: draft.slug,
        content: draft.content,
        excerpt: draft.excerpt,
        coverImage: draft.coverImage,
        tags: draft.tags,
        featured: draft.featured,
        paidFeature: draft.paidFeature,
        suspended: draft.suspended,
        updatedAt: new Date(),
      }
    );

    await Blog.deleteOne({ _id: draft._id });
    return { message: 'Draft published and original blog updated.' };
  } else {
    draft.status = 'published';
    await draft.save();
    return draft;
  }
}

export async function unpublishBlog(blogId: string) {
  await connectToMongo();
  return Blog.findByIdAndUpdate(blogId, { status: 'draft' }, { new: true });
}

// === Autosave ===

export async function autosaveBlog(blogId: string, data: Partial<BlogAPIType>) {
  await connectToMongo();
  const validated = blogAPISchema.partial().parse(data);
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error('Blog not found');



  Object.assign(blog, validated);
  return blog.save();
}

// === Queries ===

export async function getBlogById(blogId: string) {
  await connectToMongo();
  if (!mongoose.isValidObjectId(blogId)) return null;
  return Blog.findById(blogId).populate('author tool');
}

export async function getBlogBySlug(slug: string): Promise<BlogWithAuthor | null> {
  await connectToMongo();

  const blog = await Blog.findOne({ slug }).populate('author tool').lean();
  return blog as unknown as BlogWithAuthor;
}

export async function listBlogsByAuthor(authorId: string) {
  await connectToMongo();
  return Blog.find({ author: authorId }).sort({ updatedAt: -1 });
}

export async function listPaginatedBlogs({
  limit = 10,
  cursor,
  authorId,
  status,
  searchQuery = '',
}: {
  limit?: number;
  cursor?: string;
  authorId?: string;
  status?: 'draft' | 'published';
  searchQuery?: string;
}) {
  console.log("commec")
  await connectToMongo();

  const query: any = {};
  if (cursor) query._id = { $lt: cursor };
  if (authorId) query.author = authorId;
  if (status) query.status = status;
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: 'i' };
  }

  const blogs = await Blog.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate('author tool');

  const hasNextPage = blogs.length > limit;
  const items = hasNextPage ? blogs.slice(0, -1) : blogs;

  return {
    items,
    nextCursor: hasNextPage ? items[items.length - 1]._id.toString() : null,
  };
}

export async function listPublishedBlogs({ tag, limit = 10 }: { tag?: string; limit?: number }) {
  await connectToMongo();
  const filter: any = { status: 'published' };
  if (tag) filter.tags = tag;
  const blogs = await Blog.find(filter)
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('author tool')
  .lean();

return blogs.map(serializeBlog)
}

// === Admin ===

export async function toggleFeaturedBlog(blogId: string, value: boolean) {
  await connectToMongo();
  return Blog.findByIdAndUpdate(blogId, { featured: value }, { new: true });
}

export async function togglePaidFeatureBlog(blogId: string, value: boolean) {
  await connectToMongo();
  return Blog.findByIdAndUpdate(blogId, { paidFeature: value }, { new: true });
}

export async function toggleSuspendedBlog(blogId: string, suspend: boolean) {
  await connectToMongo();
  const blog = await Blog.findByIdAndUpdate(blogId, { suspended: suspend }, { new: true });
  if (!blog) throw new Error('Blog not found');
  return blog;
}
export async function listPublishedBlogsAdvanced({
  tag,
  limit = 10,
  offset,
  cursor,
  sortBy = 'createdAt',
  sortOrder = -1,
  featuredOnly = false,
  trending = false,
}: {
  tag?: string;
  limit?: number;
  offset?: number; // for offset-based pagination
  cursor?: string | null; // for cursor-based pagination
  sortBy?: string;
  sortOrder?: 1 | -1;
  featuredOnly?: boolean;
  trending?: boolean;
}) {
  await connectToMongo();

  const query: any = {
    status: 'published',
    suspended: { $ne: true },
  };

  if (tag) query.tags = tag;
  if (featuredOnly) query.featured = true;

  // Cursor pagination for createdAt
  if (cursor && sortBy === 'createdAt') {
    query.createdAt = sortOrder === -1
      ? { $lt: new Date(cursor) }
      : { $gt: new Date(cursor) };
  }

  // Sorting logic
  const sort: Record<string, 1 | -1> = {};
  if (trending) {
    sort['stats.likes'] = -1;
    sort['createdAt'] = -1; // fallback
  } else {
    sort[sortBy] = sortOrder;
  }

  let queryBuilder = Blog.find(query)
    .sort(sort)
    .limit(limit);

  // Apply offset only if cursor not used
  if (!cursor && offset !== undefined) {
    queryBuilder = queryBuilder.skip(offset);
  }

  const blogs = await queryBuilder.populate('author tool').lean();

  return blogs;
}
