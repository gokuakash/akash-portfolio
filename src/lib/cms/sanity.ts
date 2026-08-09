// ---------------------------------------------------------------------------
// Sanity client — the thin headless CMS adapter.
// Never breaks the build: if the environment variables are absent (local dev,
// CI, or the buttoned-down deployment), every getter returns the embedded
// local content layer instead. To go headless: copy .env.example → .env.local
// and add your Sanity credentials. No code changes required.
// ---------------------------------------------------------------------------

import { createClient, type SanityClient } from "@sanity/client";

/** Only instantiate the client when credentials exist. */
export function getSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01",
    useCdn: true,
    // Server-side reads can use the token for drafts; leave empty for public.
    token: process.env.SANITY_API_TOKEN || undefined,
  });
}

/**
 * Generic fetch helper. The GROQ query string is the content contract —
 * mirror the shapes in src/data/*.ts so the local fallback and CMS copies
 * remain interchangeable.
 */
export async function fetchFromSanity<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch (err) {
    console.error("[cms] Sanity fetch failed, falling back to local content:", err);
    return null;
  }
}