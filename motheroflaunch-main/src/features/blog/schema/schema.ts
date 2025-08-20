
import { z } from 'zod';
import  { Types} from 'mongoose';

export const blogFormSchema = z.object({
  title: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  paidFeature: z.boolean().optional().default(false),
  status: z.enum(['draft', 'published']),
  step: z.number().optional(),
  tool: z.string().optional(), // string ID
  coverImage: z.object({
    url: z.string().url(),
    public_id: z.string(),
  }).optional(),
});

export const objectId = z.custom<Types.ObjectId>(
    (val) => {
      if (typeof val === 'string' && Types.ObjectId.isValid(val)) {
        return true;
      }
      if (val instanceof Types.ObjectId) {
        return true;
      }
      return false;
    },
    { message: 'Invalid ObjectId' }
  ).transform((val) =>
    typeof val === 'string' ? new Types.ObjectId(val) : val as Types.ObjectId
  );

// Cover image
const coverImageSchema = z.object({
  url: z.string().url(),
  public_id: z.string(),
}).optional();

export const blogAPISchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(), // You can refine with regex for slugs
  content: z.string().optional(), // allow missing initially
  excerpt: z.string().optional(),
  coverImage: coverImageSchema,
  author: objectId,
  tool: objectId.optional(),
  tags: z.array(z.string()).optional(),
  suspended: z.boolean().optional(),
  featured: z.boolean(),
  paidFeature: z.boolean(),
  // ✅ status replaces isDraft/published
  status: z.enum(['draft', 'published']),

  // ✅ optional reference to original blog
  originalBlogId: objectId.optional(),

  // ✅ stepper support (draft-only)
  step: z.number().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})




export type BlogFormType=z.input<typeof  blogFormSchema>
export type BlogAPIType=z.infer<typeof  blogAPISchema>
export type BlogMongooseType=z.infer<typeof  blogAPISchema>