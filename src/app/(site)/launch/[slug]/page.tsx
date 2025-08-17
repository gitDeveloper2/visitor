import React from "react";
import { notFound } from "next/navigation";
import AppClient from "./Client";
import { getAppBySlug } from "@/features/apps/service/user";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
  if (!app) return { title: "App not found" };

  return {
    title: `${app.name} — BasicUtils`,
    description: app.tagline || app.fullDescription?.slice(0, 160) || "",
    openGraph: {
      title: `${app.name} — BasicUtils`,
      description: app.tagline || app.fullDescription?.slice(0, 160) || "",
      images: app.gallery?.[0] ? [app.gallery[0]] : [],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
  if (!app) return notFound();

  const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/apps/${app.slug}`;

  return (
    <main style={{ minHeight: '100vh' }}>
      <AppClient
        id={app.id}
        slug={app.slug}
        name={app.name}
        tagline={app.tagline ?? ""}
        fullDescription={app.fullDescription ?? ""}
        features={app.features ?? []}
        gallery={app.gallery ?? []}
        tags={app.tags ?? []}
        author={{
          name: app.authorName ?? "Unknown",
          avatarUrl: app.authorAvatar ?? null,
          bio: app.authorBio ?? "",
        }}
        // isVerified={Boolean(app.isVerified)}
        externalUrl={app.externalUrl ?? null}
        // publicUrl={publicUrl}
        stats={{
          likes: app.stats?.likes ?? 0,
          views: app.stats?.views ?? 0,
          installs: app.stats?.installs ?? 0,
        }}
        // Additional fields
        description={app.description ?? ""}
        category={app.category ?? ""}
        techStack={app.techStack ?? []}
        pricing={app.pricing ?? ""}
        website={app.website ?? ""}
        github={app.github ?? ""}
      />
    </main>
  );
}
