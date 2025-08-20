import { z } from "zod";
import { Types } from "mongoose";

// Validates and transforms a string into a Mongoose ObjectId
export const zodObjectId = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .transform((val) => new Types.ObjectId(val));

// Stats sub-schema
const statsSchema = z.object({
  views: z.number().default(0),
  clicks: z.number().default(0),
  votes: z.number().default(0),
  appearances: z.number().default(0),
  featuredLists: z.array(zodObjectId).default([]),
});

// Create tool schema
export const createToolSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  websiteUrl: z.string().url(),
  ownerId: zodObjectId,

  tagline: z.string().optional(),

  logo: z.object({
    url: z.string().url(),
    public_id: z.string(),
  }),

  screenshots: z
    .array(
      z.object({
        url: z.string().url(),
        public_id: z.string(),
      })
    )
    .default([]),

    category: zodObjectId.optional(),

  tags: z.string().optional(),

  platforms: z
    .array(z.enum(["web", "ios", "android", "mac", "windows", "linux"]))
    .default([]),

  status: z.enum(["beta", "upcoming", "launched", "draft"]).default("draft"),

  launchDate: z.coerce.date().optional(),

  stats: statsSchema.default({}),

  // ✅ Pricing plans
  pricing: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        features: z.array(z.string().min(1)).min(1),
        isFree: z.boolean().optional(),
        highlight: z.boolean().optional(),
      })
    )
    .optional(),

  // ✅ Feature list
  features: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .optional(),

  // ✅ Creator info (you might persist this or just use user reference)
  creators: z
    .array(
      z.object({
        name: z.string().min(1),
        avatarUrl: z.string().url(),
        headline: z.string().optional(),
        bio: z.string().optional(),
        githubUsername: z.string().optional(),
        twitterUsername: z.string().optional(),
        websiteUrl: z.string().url().optional(),
      })
    )
    .optional(),
});


// Update schema (partial of create)


// Existing schema...
export const createToolFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  tagline: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(), // you can validate it separately or in the server schema

  websiteUrl: z.string().url("Must be a valid URL"),

  logo: z
    .object({
      url: z.string().url(),
      public_id: z.string(),
    })
    .optional(),

  screenshots: z
    .array(
      z.object({
        url: z.string().url(),
        public_id: z.string(),
      })
    )
    .optional(),

  tags: z.string().optional(),

  platforms: z.array(z.enum(["web", "ios", "android", "mac", "windows", "linux"])),

  status: z.enum(["upcoming", "launched", ]),

  launchDate: z.coerce.date().optional(),

  // NEW — Pricing plans
  pricing: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1), // e.g., "$10/month" or "Free"
        features: z.array(z.string().min(1)).min(1),
        isFree: z.boolean().optional(),
        highlight: z.boolean().optional(),
      })
    )
    .optional(),

  // NEW — Features list
  features: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .optional(),

  // NEW — Creator info (optional, or handled automatically server-side)
  creators: z
    .array(
      z.object({
        name: z.string().min(1),
        avatarUrl: z.string().url(),
        headline: z.string().optional(),
        bio: z.string().optional(),
        githubUsername: z.string().optional(),
        twitterUsername: z.string().optional(),
        websiteUrl: z.string().url().optional(),
      })
    )
    .optional(),
});

export type ToolFormData = z.infer<typeof createToolFormSchema>;
export const updateToolSchema = createToolSchema.partial();

