// ---------------------------------------------------------------------------
// CMS content layer — the single access point for content across the app.
// Pattern: try Sanity → fall back to local data. Because every getter is
// async-free in the local path, hydration cost stays zero, and the copy in
// src/data/ is the pre-seeded, ready-to-ship content.
// ---------------------------------------------------------------------------

import { fetchFromSanity as fetchSanity } from "./sanity";
import { projects as localProjects } from "@/data/projects";

// Lightweight "has CMS" probe used anywhere we mention it in the UI.
export const hasCms = () => Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

/** All featured projects (CMS-first, local fallback). */
export async function getAllProjects() {
  const remote = await fetchSanity<unknown[]>(
    `*[_type == "project"] | order(year desc){
      "id": _id, title, tagline, year, role, industry, category,
      stack, problem, solution, process, results,
      "image": image.asset->url, "live": liveUrl, "repo": repoUrl,
      "posterHue": 260
    }`,
  );
  if (remote && remote.length > 0) return remote;
  return Promise.resolve(localProjects);
}

/** Site copy (hero, nav, footer strings) from CMS when available. */
export async function getSiteCopy() {
  return fetchSanity<unknown>(`*[_type == "site"][0]{name, role, tagline, email, socials}`);
}