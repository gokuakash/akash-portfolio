// ---------------------------------------------------------------------------
// Project content — the core of the portfolio.
// Each project is a full "Process Deep Dive": problem → process → solution
// → quantifiable results. Images are local procedural SVG posters; swap the
// `image` path for real WebP screenshots without touching any component.
// ---------------------------------------------------------------------------

export interface Kpi {
  value: number; // numeric value for the animated counter
  decimals?: number;
  suffix?: string; // "%" | "k" | "ms" …
  prefix?: string;
  label: string;
}

export interface ProcessPhase {
  phase: string; // "01"
  title: string;
  body: string;
  /** 0–100 completion of the phase — drives the mini progress rail. */
  weight: number;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  industry: string;
  category: "fullstack" | "frontend" | "3d-motion" | "design-systems";
  stack: string[];
  image: string;
  posterHue: number; // drives the SVG poster gradient variants
  problem: string;
  solution: string[];
  process: ProcessPhase[];
  results: Kpi[];
  live: string;
  repo: string;
}

export const categories = [
  { id: "all", label: "All Work" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "3d-motion", label: "3D & Motion" },
  { id: "design-systems", label: "Design Systems" },
] as const;

export const projects: Project[] = [
  {
    id: "pulse",
    title: "Pulse",
    tagline: "A fintech dashboard that turns raw transactions into financial confidence.",
    year: "2025",
    role: "Lead Full-Stack Engineer",
    industry: "Fintech · B2B SaaS",
    category: "fullstack",
    stack: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Redis", "Recharts", "WebSockets"],
    image: "/images/projects/pulse.svg",
    posterHue: 252,
    problem:
      "Nova Bank's SME clients were churning at onboarding. The dashboard dumped 40,000 rows of raw transactions on screen with zero interpretation — users couldn't answer the single question they arrived with: “Where did my money go?”",
    solution: [
      "An AI copilot, “Explain this charge”, that narrates any transaction in plain language inside a keyboard-friendly drawer.",
      "Progressive disclosure: dense tables collapsed into a 4-panel summary — cash flow, burn, forecasts, alerts.",
      "A tokenized design system (shared with 3 internal teams) to keep the information hierarchy honest at every breakpoint.",
    ],
    process: [
      {
        phase: "01",
        title: "Discovery & data autopsy",
        weight: 30,
        body: "Session-recorded 14 onboarding flows, then joined 6 user interviews with product analytics. The killer insight: 73% of first-session actions were “search” with zero results.",
      },
      {
        phase: "02",
        title: "Prototype in production",
        weight: 55,
        body: "Instead of a throwaway Figma flow, I shipped a behind-a-flag prototype on the real API in 3 weeks. Every iteration was measured — nothing survived without a movement in activation.",
      },
      {
        phase: "03",
        title: "Ship, measure, expand",
        weight: 15,
        body: "Rolled out to 10% of accounts, watched funnel telemetry for 14 days, then scaled to all 84k customers with a phased feature-flag ramp.",
      },
    ],
    results: [
      { value: 37, suffix: "%", label: "Activation lift in 90 days" },
      { value: 42, suffix: "%", label: "Fewer support tickets" },
      { value: 1.2, suffix: "s", decimals: 1, label: "Time-to-interactive (was 4.8s)" },
      { value: 99.2, suffix: "%", decimals: 1, label: "Uptime over 12 months" },
    ],
    live: "https://pulse.novabank.example",
    repo: "https://github.com/akashverma/pulse",
  },
  {
    id: "aurora",
    title: "Aurora",
    tagline: "A headless commerce storefront for a D2C health brand with a conscience.",
    year: "2024",
    role: "Frontend Architect",
    industry: "Commerce · D2C",
    category: "frontend",
    stack: ["Next.js", "Edge Rendering", "Motion", "Zustand", "Stripe", "Search & ISR"],
    image: "/images/projects/aurora.svg",
    posterHue: 185,
    problem:
      "Helio Health's storefront weighed 4.8 MB and took 6.2s to render its first product image. On mobile — where 71% of revenue happened — the bounce rate was 64%. The design system had 14 competing button styles.",
    solution: [
      "An edge-rendered catalog with ISR revalidation and a 42 KB critical path — every route hits a 95+ mobile Lighthouse score.",
      "A scroll-choreographed PDP: ingredients, carbon data, and reviews reveal in sequence, cut with a WebGL product turntable.",
      "One tokenized UI kit, one button. The checkout funnel was rebuilt as a single mental model: bag → address → pay.",
    ],
    process: [
      {
        phase: "01",
        title: "Performance baseline",
        weight: 25,
        body: "Budgeted by WebPageTest across 4G/3G. The LCP culprit was a 2.1 MB hero carousel nobody clicked; we deleted it in week one.",
      },
      {
        phase: "02",
        title: "Design-engine sprint",
        weight: 60,
        body: "Every screen was prototyped in code first. Motion was prototyped at 60fps in the browser — anything that missed frame budget was cut.",
      },
      {
        phase: "03",
        title: "Flagged roll-out",
        weight: 15,
        body: "Shipped behind an edge flag, shadow-tested against the legacy store for 2 weeks, then flipped with a 24-hour watch window.",
      },
    ],
    results: [
      { value: 52, suffix: "%", label: "Faster LCP (0.9s vs 6.2s)" },
      { value: 23, suffix: "%", label: "Conversion rate increase" },
      { value: 18, suffix: "%", label: "Average order value growth" },
      { value: 64, suffix: "%", label: "Mobile bounce-rate reduction" },
    ],
    live: "https://aurora.heliohealth.example",
    repo: "https://github.com/akashverma/aurora",
  },
  {
    id: "terra",
    title: "Terra",
    tagline: "A climate-intelligence platform rendering planetary data as a live 3D globe.",
    year: "2024",
    role: "3D & Data Engineer",
    industry: "Climate Tech · B2B",
    category: "3d-motion",
    stack: ["React", "Three.js / R3F", "d3", "WebGL", "Rust→WASM", "Deck.gl"],
    image: "/images/projects/terra.svg",
    posterHue: 145,
    problem:
      "Opal Labs was serving 1.4M daily satellite-tile requests with 11-second query latency. Researchers opened a static map, not a decision tool. The platform needed to feel like a living model of the planet.",
    solution: [
      "A WebGL globe with GPU-driven tile decoding (Rust→WASM pipeline) that renders 14 data layers at 60fps in the browser.",
      "A d3-powered query builder with time scrubbing — researchers slide through 40 years of temperature anomaly data.",
      "A narrative mode: NGOs tell data stories as guided 3D flights instead of exporting static PNGs.",
    ],
    process: [
      {
        phase: "01",
        title: "Data pipeline surgery",
        weight: 35,
        body: "Profiled the tile pipeline end-to-end. The 11s of latency was 9s of it server-side decoding — moved decoding to the client GPU.",
      },
      {
        phase: "02",
        title: "The 60fps rule",
        weight: 50,
        body: "Every interaction was budgeted at 16.7ms. Layer blending, instancing, and LOD were tuned frame-by-frame on a mid-range laptop.",
      },
      {
        phase: "03",
        title: "Research validation",
        weight: 15,
        body: "Ran 2-week pilot with 5 climate-research groups; iterated on the time-scrubber UX until analysts stopped opening Excel.",
      },
    ],
    results: [
      { value: 63, suffix: "%", label: "Lower query latency" },
      { value: 1.4, suffix: "M", label: "Tiles served daily" },
      { value: 31, suffix: "", label: "NGOs onboarded" },
      { value: 2, suffix: "×", label: "Design awards won" },
    ],
    live: "https://terra.opallabs.example",
    repo: "https://github.com/akashverma/terra",
  },
  {
    id: "muse",
    title: "Muse",
    tagline: "An open-source design & motion system that made 12 teams move at one rhythm.",
    year: "2023",
    role: "Creator · Design Engineer",
    industry: "Open Source · Tooling",
    category: "design-systems",
    stack: ["React", "TypeScript", "Motion", "Storybook", "Design Tokens", "Radix"],
    image: "/images/projects/muse.svg",
    posterHue: 330,
    problem:
      "Across 12 product teams, the same input field was styled 9 different ways. Shipping a button took a design handoff, a ticket, and a week. The company was paying for design debt in velocity.",
    solution: [
      "A token-first component library: every primitive ships with a motion spec (duration, easing, choreography) baked in.",
      "Motion presets that respect `prefers-reduced-motion` by default — accessibility is a default, not a ticket.",
      "A “design to code in zero hand-offs” workflow: Figma variables → tokens → components, all verified in Storybook.",
    ],
    process: [
      {
        phase: "01",
        title: "Audit & taxonomy",
        weight: 30,
        body: "Crawled 42 repositories and 6,000 components to find the real (not imagined) pattern landscape. 214 unique buttons became one.",
      },
      {
        phase: "02",
        title: "Token the motion",
        weight: 55,
        body: "Defined a motion language — one easing curve, one duration scale — and proved it with before/after recordings in the docs.",
      },
      {
        phase: "03",
        title: "Adoption as a product",
        weight: 15,
        body: "Treated internal adoption like an external launch: docs, office hours, migration codemods, and a public open-source release.",
      },
    ],
    results: [
      { value: 8.2, suffix: "k", label: "GitHub stars (OSS)" },
      { value: 96, suffix: "%", label: "Component reuse rate" },
      { value: 74, suffix: "%", label: "Faster design-to-dev time" },
      { value: 41, suffix: "k", label: "Downloads / month" },
    ],
    live: "https://muse.akashverma.dev",
    repo: "https://github.com/akashverma/muse",
  },
];
