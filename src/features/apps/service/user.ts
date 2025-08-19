// lib/apps.ts

import { connectToDatabase } from "@lib/mongodb";
import { cache } from 'react';
import { ObjectId } from "mongodb";

export type AppRecord = {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  fullDescription?: string;
  features?: string[];
  gallery?: string[];
  tags?: string[];
  authorName?: string;
  authorAvatar?: string | null;
  authorBio?: string;
  isVerified: boolean;
  externalUrl?: string;
  stats?: { likes?: number; views?: number; installs?: number };
  // Additional fields for comprehensive display
  description?: string;
  category?: string;
  techStack?: string[];
  pricing?: string;
  website?: string;
  github?: string;
};

export const getAppBySlug = cache(async function getAppBySlug(slug: string): Promise<AppRecord | null> {
  if (!slug || typeof slug !== "string") {
    console.error("Invalid slug:", slug);
    return null;
  }

  const { db } = await connectToDatabase();
  console.log("Using DB:", db.databaseName);
  console.log("Collections:", await db.listCollections().toArray());

  const record = await db.collection("userapps").findOne({ slug });

  console.log("Fetched app record by slug:", slug, record);

  if (!record) return null;

  return {
    id: record._id.toString(),
    slug: record.slug || record._id.toString(), // keep fallback to _id
    name: record.name,
    tagline: record.tagline || record.description?.slice(0, 100) || "",
    fullDescription: record.fullDescription || record.description || "",
    description: record.description || "",
    features: record.features || [],
    gallery: record.gallery || [],
    tags: record.tags || [],
    authorName: record.authorName || record.author || "",
    authorAvatar: record.authorAvatar || null,
    authorBio: record.authorBio || "",
    isVerified: !!record.isVerified,
    externalUrl: record.externalUrl || record.website || null,
    category: record.category || "Other",
    techStack: record.techStack || [],
    pricing: record.pricing || "Free",
    website: record.website || "",
    github: record.github || "",
    stats: {
      likes: record.likes || record.stats?.likes || 0,
      views: record.views || record.stats?.views || 0,
      installs: record.installs || record.stats?.installs || 0,
    },
  };
});

  
