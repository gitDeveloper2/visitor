import { Types } from "mongoose";
import { BlogAPIType, BlogFormType } from "../schema/schema";
// utils/formToApiBlog.ts
export function formToApiBlog(
    input: BlogFormType,
    userId: string,
    slug: string
  ): BlogAPIType {
    return {
      title: input.title ?? '',
      slug,
      content: input.content ?? '',
      excerpt: input.excerpt ?? '',
      coverImage: input.coverImage,
      author: new Types.ObjectId(userId),
      tool: input.tool ? new Types.ObjectId(input.tool) : undefined,
      tags: input.tags ?? [],
      featured: input.featured ?? false,
      paidFeature: input.paidFeature ?? false,
      status: input.status ?? 'draft',
      step: input.step ?? 0,
      suspended: false,
      originalBlogId: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
 
  export function partialFormToApiPatch(
    input: Partial<BlogFormType>
  ): Partial<BlogAPIType> {
    const patch: Partial<BlogAPIType> = {};
  
    if ('title' in input) patch.title = input.title;
    if ('content' in input) patch.content = input.content;
    if ('excerpt' in input) patch.excerpt = input.excerpt;
    if ('coverImage' in input) patch.coverImage = input.coverImage;
    if ('tags' in input) patch.tags = input.tags;
    if ('featured' in input) patch.featured = input.featured;
    if ('paidFeature' in input) patch.paidFeature = input.paidFeature;
    if ('status' in input) patch.status = input.status;
    if ('step' in input) patch.step = input.step;
    if ('tool' in input) {
      patch.tool = input.tool ? new Types.ObjectId(input.tool) : undefined;
    }
  
    // Don't update slug or author
    patch.updatedAt = new Date();
  
    return patch;
  }
  
