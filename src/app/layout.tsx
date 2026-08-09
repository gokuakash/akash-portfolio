// ---------------------------------------------------------------------------
// Root layout — SSR shell with SEO metadata, fluid fonts, and the app shell.
// Fonts are self-hosted via next/font (zero layout shift, no render block).
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { Fraunces, Inter, Syne } from "next/font/google";
import { RootProviders } from "@/components/providers/RootProviders";
import { site } from "@/data/site";
import { getAllProjects } from "@/lib/cms";
import "./globals.css";

// Primary sans: Inter — ultimate readability.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display font: Syne — kinetic, characterful, for massive headlines.
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

// Serif accent: Fraunces (italic) for pull quotes & data narration.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.fullName} — ${site.role}`,
    template: `%s · ${site.fullName}`,
  },
  description:
    "Akash.S — full-stack engineer and product designer. Eight years turning ambiguous problems into measurable product outcomes: interfaces that convert, systems that scale, motion that matters.",
  keywords: [
    "full-stack engineer",
    "product designer",
    "design engineer",
    "Next.js developer",
    "motion design",
    "Three.js",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    url: site.domain,
    siteName: site.fullName,
    title: `${site.fullName} — ${site.role}`,
    description: site.tagline,
    images: [{ url: "/images/og.svg", width: 1200, height: 630, alt: site.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — ${site.role}`,
    description: site.tagline,
    creator: "@akashbuilds",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Content is resolved once at request time; the CMS layer falls back to
  // the local data module when Sanity isn't configured (never breaks build).
  void getAllProjects().catch(() => {});

  return (
    // suppressHydrationWarning: the theme bootstrap script intentionally adds
    // the .dark class to <html> before hydration — React must ignore that
    // attribute difference (the sanctioned pattern for theme providers).
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${fraunces.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <RootProviders>
          <main id="main">{children}</main>
        </RootProviders>
      </body>
    </html>
  );
}