// ---------------------------------------------------------------------------
// Sitemap — single-page portfolio, but structured for crawlers anyway.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { site } from "@/data/site";

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
  ];
}