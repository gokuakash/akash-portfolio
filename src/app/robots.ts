// ---------------------------------------------------------------------------
// Robots.txt — allow everything; point crawlers at the sitemap.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}