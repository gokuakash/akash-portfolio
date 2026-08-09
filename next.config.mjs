// Next.js configuration — tuned for the <1.5s load-time budget.
// @see https://nextjs.org/docs/app/api-reference/next-config-js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow remote images when a headless CMS (Sanity) is wired up.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "**.unsplash.com" },
    ],
  },

  // Keep the initial HTML payload lean; the heavy 3D/cursor bundles are
  // code-split client-side via `next/dynamic` in the components themselves.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  headers: async () => [
    {
      source: "/:path*",
      headers: [
        // Security headers — baseline hardening for a production portfolio.
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],
};

export default nextConfig;
