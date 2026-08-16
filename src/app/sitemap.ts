// ---------------------------------------------------------------------------
// Sitemap — home + blog index + every article, each a crawlable URL.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { posts } from "@/data/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: site.domain,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      images: [
        // Swap in the real headshot here too once public/images/akash-portrait.jpg exists.
        `${site.domain}/images/og.png`,
      ],
    },
    {
      url: `${site.domain}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: `${site.domain}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}