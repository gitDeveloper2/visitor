// app/apps/[slug]/page.tsx  (SERVER)
import React from "react";
import { notFound } from "next/navigation";
import AppClient from "./Client";
 
type AppRecord = {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  fullDescription?: string; // long-form content (plaintext or sanitized HTML/markdown converted server-side)
  features?: string[];
  gallery?: string[]; // image URLs
  tags?: string[];
  authorName?: string;
  authorAvatar?: string | null;
  authorBio?: string;
  isVerified: boolean;
  externalUrl?: string;
  stats?: { likes?: number; views?: number; installs?: number };
};
 
// TODO: replace this stub with your real DB fetch (Prisma / Postgres / Mongo, etc.)
async function getAppBySlug(slug: string): Promise<AppRecord | null> {
  // Example enriched record for demo. Replace with DB lookup.
  if (slug === "snippet-saver") {
    return {
      id: "app-1",
      slug: "snippet-saver",
      name: "Snippet Saver",
      tagline: "Save and manage your favorite code snippets with ease.",
      fullDescription:
        `Save and manage your favorite code snippets with ease.

        Snippet Saver helps developers store, organize, and retrieve code snippets exactly when they need them. Built for speed and simplicity, it supports syntax highlighting, intuitive tagging, and a lightning-fast search so you can find what you need instantly.
        
        We launched with powerful features like:
        • Save unlimited snippets
        • Organize with tags & categories
        • Syntax highlighting for 20+ languages
        • Shareable links to send snippets to teammates
        
        Perfect for indie hackers, teams, and anyone tired of rewriting the same code twice.`,
      features: ["Save snippets", "Tagging & search", "Syntax highlighting", "Shareable links"],
      gallery: [
        "/images/snippet-1.png",
        "/images/snippet-2.png",
      ],
      tags: ["productivity", "developer", "tools"],
      authorName: "Jane Doe",
      authorAvatar: null,
      authorBio: "Indie developer — loves developer tooling and UX.",
      isVerified: true,
      externalUrl: "https://snippet-saver.example.com/",
      stats: { likes: 124, views: 2043, installs: 812 },
    };
  }
  return null;
}
 
// Server metadata (keeps SEO good)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
  if (!app) return { title: "App not found" };
  return {
    title: `${app.name} — YourSite`,
    description: app.tagline ?? app.fullDescription?.slice(0, 160) ?? "",
    openGraph: {
      title: `${app.name} — YourSite`,
      description: app.tagline ?? app.fullDescription?.slice(0, 160) ?? "",
      // optionally add images: app.gallery?.[0]
    },
  };
}
 
export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const app = await getAppBySlug(slug);
  if (!app) return notFound();
 
  const publicUrl = `https://your-site.com/apps/${app.slug}`;
 
  // Prepare serializable props for the client component
  const clientProps = {
    id: app.id,
    slug: app.slug,
    name: app.name,
    tagline: app.tagline ?? "",
    fullDescription: app.fullDescription ?? "",
    features: app.features ?? [],
    gallery: app.gallery ?? [],
    tags: app.tags ?? [],
    author: {
      name: app.authorName ?? "Unknown",
      avatarUrl: app.authorAvatar ?? null,
      bio: app.authorBio ?? "",
    },
    isVerified: Boolean(app.isVerified),
    externalUrl: app.externalUrl ?? null,
    publicUrl,
    stats: {
      likes: (app.stats?.likes ?? 0),
      views: (app.stats?.views ?? 0),
      installs: (app.stats?.installs ?? 0),
    },
  } as const;
 
  return (
    <main>
      {/* Client component will render the UI and is allowed to use useTheme, clipboard, etc. */}
      <AppClient {...clientProps} />
    </main>
  );
}
