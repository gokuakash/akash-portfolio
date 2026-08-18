// ---------------------------------------------------------------------------
// Site-level content: identity, navigation, socials, metrics.
// Single source of truth — consumed by layout, hero, footer, SEO.
// ---------------------------------------------------------------------------

export const site = {
  name: "Akash.S",
  fullName: "Akash.S",
  role: "Full-Stack Engineer & Product Designer",
  tagline: "I design and engineer digital products that feel inevitable.",
  location: "Chennai · Coimbatore · Bengaluru, India · UTC+5:30",
  email: "vewo.works@gmail.com",
  phone: "+91 96554 58315",
  phoneHref: "tel:+919655458315",
  // Live origin Google will index. Override via NEXT_PUBLIC_SITE_URL in Vercel
  // once a custom domain (e.g. akashs.dev) is connected — one env var, done.
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://akash-portfolio-xi-six.vercel.app",
  availability: "Currently booking new projects for Q4 2026.",
} as const;

export const nav = [
  { index: "01", label: "Story", href: "#story" },
  { index: "02", label: "Work", href: "#work" },
  { index: "03", label: "Journey", href: "#journey" },
  { index: "04", label: "Contact", href: "#contact" },
] as const;

export const socials = [
  { label: "Phone", handle: site.phone, url: site.phoneHref },
  { label: "Email", handle: site.email, url: `mailto:${site.email}` },
] as const;

/** Hero bottom-strip metrics — scrolled into view after first interaction. */
export interface Metric {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

export const metrics: readonly Metric[] = [
  { value: 8, suffix: "+", label: "Years shipping products" },
  { value: 42, suffix: "", label: "Products launched" },
  { value: 99, suffix: "", label: "Avg. Lighthouse score" },
  { value: 8.2, suffix: "k", label: "OSS GitHub stars", decimals: 1 },
] as const;

/** Marquee of client / partner wordmarks (rendered as styled text, no logos). */
export const clients = [
  "Nova Bank",
  "Helio Health",
  "Opal Labs",
  "Fathom AI",
  "Gridline",
  "Polaris",
  "Verdi",
  "Northbeam",
] as const;
