import { z } from "zod";

export const schema = z.object({
    domain: z.string().nonempty('Domain is required'),
    slug: z.string().nonempty('Slug is required'),
    title: z.string().nonempty('Title is required'),
    content: z.string().nonempty('Content is required'),
    keywords: z.string().optional(),
    meta_description: z.string().optional(),
    canonical_url: z.string().optional(),
    image_url: z.string().optional(),
    image_attribution: z.string().optional(),
    image_caption: z.string().optional(),
    relatedPages: z.string().optional(),
  });
  