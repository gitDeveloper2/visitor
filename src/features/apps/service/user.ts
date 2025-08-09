// lib/apps.ts

import { connectToDatabase } from "@lib/mongodb";
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
};

export async function getAppBySlug(slug: string): Promise<AppRecord | null> {
    if (!ObjectId.isValid(slug)) {
      console.error("Invalid ObjectId:", slug);
      return null;
    }
  
    const { db } = await connectToDatabase();
    console.log("Using DB:", db.databaseName);
console.log("Collections:", await db.listCollections().toArray());
const record = await db.collection("userapps").findOne({ _id: new ObjectId(slug) });
  
    console.log("Fetched app record:", slug, record);
  
    if (!record) return null;
  
    return {
      id: record._id.toString(),
      slug: record._id.toString(), // since you're using _id as slug
      name: record.name,
      tagline: record.tagline ?? record.description ?? "",
      fullDescription: record.fullDescription ?? "",
      features: record.features ?? [],
      gallery: record.gallery ?? [],
      tags: record.tags ?? [],
      authorName: record.authorName ?? "",
      authorAvatar: record.authorAvatar ?? null,
      authorBio: record.authorBio ?? "",
      isVerified: !!record.isVerified,
      externalUrl: record.externalUrl ?? null,
      stats: {
        likes: record.stats?.likes ?? 0,
        views: record.stats?.views ?? 0,
        installs: record.stats?.installs ?? 0,
      },
    };
  }
  
