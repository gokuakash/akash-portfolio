// ---------------------------------------------------------------------------
// Journal — writing for search (topical depth) and for clients (proof of craft).
// Each post targets a keyword cluster: SaaS development, web development,
// product design. Blocks are typed so the reader stays trivially accessible.
// ---------------------------------------------------------------------------

export type PostBlock =
  | { t: "p"; x: string }
  | { t: "h2"; x: string }
  | { t: "ul"; x: string[] }
  | { t: "quote"; x: string };

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  blocks: PostBlock[];
}

export const posts: Post[] = [
  {
    slug: "scaling-saas",
    title: "Scaling a SaaS: auth, multi-tenancy and the APIs your users never see",
    description:
      "What eight years of shipping SaaS products taught me about auth, multi-tenant architecture and the API contracts that decide whether a product survives year two.",
    date: "2026-08-04",
    readingTime: "6 min read",
    tags: ["SaaS Development", "Architecture", "APIs"],
    blocks: [
      {
        t: "p",
        x: "Most SaaS products don't die from bad UI. They die from the architecture under it — the moment a second customer arrives with a different workflow, or a first enterprise buyer asks 'can we SSO?', or a p99 latency chart starts climbing at 9am sharp every morning. As a SaaS developer, your real job isn't shipping features. It's shipping invariants.",
      },
      { t: "h2", x: "Auth is a product decision, not a library call" },
      {
        t: "p",
        x: "The temptation is to reach for an auth provider and never think about it again. The providers are good — but the decisions you make around them are yours: session lifetime, refresh semantics, which identity is canonical, how team membership maps to tenancy. Decide those explicitly, and the provider is just an implementation detail you can swap later.",
      },
      {
        t: "ul",
        x: [
          "Pick one identity store and make everything else reference it — never duplicate emails or user records across tables.",
          "Design sessions to be revocable: a stolen token should die in minutes, not at expiry.",
          "Treat team membership as its own domain — invitations, roles and billing seats belong in one consistent state machine.",
        ],
      },
      { t: "h2", x: "Multi-tenancy: shared, but never entangled" },
      {
        t: "p",
        x: "Every tenant should feel like the only tenant. Shared infrastructure is fine and cheaper; shared state is not. Enforce tenancy at the database layer with row-level ownership and at the API layer with scoped queries — not by sprinkling WHERE tenant_id clauses in application code and hoping. The day one tenant's data leaks into another's export is the day the product dies.",
      },
      { t: "h2", x: "APIs are the contract with your own future" },
      {
        t: "p",
        x: "The mobile app, the CLI, the partner integrations, the AI layer you'll add in year three — all of them consume your API. Versioning is cheap; regret is expensive. Return stable, typed payloads, keep breaking changes behind /v2, and treat the API as the product it will eventually be sold as.",
      },
      {
        t: "quote",
        x: "SaaS development is the discipline of making the invisible parts — sessions, tenancy, contracts — boringly reliable, so the visible parts can be delightful.",
      },
      {
        t: "p",
        x: "That's the thread through everything I build: the pipelines and data models get the same care as the interface, because in a SaaS product the interface is just the front door to the architecture.",
      },
    ],
  },
  {
    slug: "lighthouse-99",
    title: "How I ship websites that score 99+ on Lighthouse — every time",
    description:
      "The concrete checklist I run on every build: font loading, image budgets, render-blocking JS, and the performance traps that quietly eat your Lighthouse score.",
    date: "2026-07-21",
    readingTime: "5 min read",
    tags: ["Web Development", "Performance", "Core Web Vitals"],
    blocks: [
      {
        t: "p",
        x: "A fast website is not a feature — it's the default state of a well-built one. In eight years of web development I've rarely optimized a slow site; I've almost always removed the choices that made it slow. Here's the checklist I run on every build, in order of impact.",
      },
      { t: "h2", x: "1. Fonts: self-host, subset, swap" },
      {
        t: "p",
        x: "Google Fonts in production is the single most common LCP killer. Self-host with a modern loader, subset to latin, and use display: swap so text paints instantly. Zero layout shift, zero render blocking, one request from your own origin.",
      },
      { t: "h2", x: "2. Images: budget before you build" },
      {
        t: "ul",
        x: [
          "SVG for everything that can be vector — logos, icons, portraits, OG images. A 20KB SVG beats a 400KB PNG at every DPI.",
          "Raster only where it has to be raster, served with width/height attributes so the layout never shifts.",
          "Never ship an image the browser can't see: lazy-load below the fold with the right sizes hint.",
        ],
      },
      { t: "h2", x: "3. JS: static first, interactive second" },
      {
        t: "p",
        x: "The fastest JavaScript is the JavaScript you don't send. Server-render the content, hydrate what needs to be interactive, and let anything heavy — 3D scenes, charts, elaborate animation — mount lazily after the hero is on screen. A hundred-kilo first load is a choice, not a necessity.",
      },
      { t: "h2", x: "4. The traps that eat your score quietly" },
      {
        t: "ul",
        x: [
          "Hero carousels and autoplay video — the classic LCP killers nobody plans for.",
          "Analytics and tag managers loading before first paint.",
          "CSS frameworks shipping a thousand unused rules.",
          "Uncapped WebGL pixel ratios on phones — the reason 'it's slow on my iPhone'.",
        ],
      },
      {
        t: "quote",
        x: "Performance is not polish you add at the end. It's a constraint you design inside from the first commit.",
      },
    ],
  },
  {
    slug: "motion-that-matters",
    title: "Motion that matters: product design lessons from 8 years of interfaces",
    description:
      "Good motion isn't decoration — it's communication. What I've learned designing motion into products: easing curves, choreography, and knowing what to leave still.",
    date: "2026-07-02",
    readingTime: "5 min read",
    tags: ["Product Design", "Web Design", "Motion"],
    blocks: [
      {
        t: "p",
        x: "For most of my career I've been the person who gets handed a finished design and told to 'make it feel alive.' The truth I've landed on: motion is not what you add to a design — it's the part of the design that tells the user what just happened and what happens next. As a product designer, that's your real material.",
      },
      { t: "h2", x: "Motion is a language, not a garnish" },
      {
        t: "p",
        x: "Every movement in an interface should answer a question. A modal slides up because it's the next layer of the stack. A card lifts on hover because it's saying 'I can be opened.' A number counts up because the change matters. When every element moves with the same easing and the same duration, users stop noticing the motion — and that's exactly when it's working.",
      },
      { t: "h2", x: "The curve is the character" },
      {
        t: "ul",
        x: [
          "Default your whole system to one easing curve — a custom cubic-bezier with a fast start and a gentle settle reads as 'premium' in every context.",
          "Respect distance: large elements move slower than small ones, or the eye loses the narrative.",
          "Stagger by intent, not by habit — a 40ms cascade signals order; a 400ms one signals a loading spinner.",
        ],
      },
      { t: "h2", x: "Know what to leave still" },
      {
        t: "p",
        x: "The most underrated animation skill is restraint. The hero can move; the nav should not. The empty state can breathe; the form should not. Every moving element competes for attention, so the design decision is deciding what deserves it. That's also what respects users who arrive with reduced-motion preferences — a site that respects them is a site that respects everyone.",
      },
      {
        t: "quote",
        x: "Great motion feels inevitable. You never think 'nice animation' — you just know where things came from and where they're going.",
      },
      {
        t: "p",
        x: "That's the bar I hold every interface to, whether I'm wearing the designer hat or the web designer hat: if the motion has to announce itself, it has already failed.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}