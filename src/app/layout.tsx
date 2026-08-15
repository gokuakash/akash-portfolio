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
    default: `${site.fullName} — Web Developer, Product Designer & SaaS Developer`,
    template: `%s · ${site.fullName}`,
  },
  description:
    "Akash.S — web developer, web designer, product designer and SaaS developer in Bengaluru, India. Eight years turning ambiguous problems into measurable product outcomes: interfaces that convert, systems that scale, motion that matters.",
  keywords: [
    "web developer",
    "web designer",
    "product designer",
    "saas developer",
    "full-stack engineer",
    "design engineer",
    "Next.js developer",
    "React developer",
    "UI UX designer",
    "website developer",
    "motion design",
    "Three.js",
    "bengaluru web developer",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.domain,
    siteName: site.fullName,
    title: `${site.fullName} — Web Developer, Product Designer & SaaS Developer`,
    description: site.tagline,
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: site.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — Web Developer, Product Designer & SaaS Developer`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
  verification: { google: "F8_5ha3JqdJNnzH26tfwREgLmUOeqmEiEEw5L1yoNtI" },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.domain}/#person`,
      name: site.fullName,
      url: site.domain,
      email: `mailto:${site.email}`,
      telephone: "+91-9655458315",
      jobTitle: "Web Developer, Product Designer & SaaS Developer",
      // Google only indexes real raster photos (JPEG/WEBP/PNG), not the SVG
      // used on the page. Point this at /images/akash-portrait.jpg the moment
      // a real headshot is dropped into public/images/ — Google will then
      // surface it in image results and the knowledge panel.
      image: `${site.domain}/images/og.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
      knowsAbout: ["Web Development", "Web Design", "Product Design", "SaaS Development"],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${site.domain}/#service`,
      name: `${site.fullName} — Web Development, Web Design, Product Design & SaaS Development`,
      url: site.domain,
      telephone: "+91-9655458315",
      email: site.email,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
      areaServed: { "@type": "City", name: "Bengaluru" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Developer" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Designer" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product Designer" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Developer" } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.domain}/#website`,
      url: site.domain,
      name: site.fullName,
      publisher: { "@id": `${site.domain}/#person` },
      inLanguage: "en",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}