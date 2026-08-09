// ---------------------------------------------------------------------------
// Thought leadership (mini-blog) + client testimonials.
// ---------------------------------------------------------------------------

export interface Insight {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  body: string;
  readTime: string;
  date: string;
}

export const insights: Insight[] = [
  {
    id: "whispering-interfaces",
    tag: "Design Trends",
    title: "Why 2026 interfaces whisper",
    excerpt: "The loudest pattern of the decade is restraint — and it's measurable.",
    body: "After two years of maximalism, the interfaces winning retention budgets are the ones that lower their voice. Every element I added to a 2026 product had to justify its existence against one question: does this earn the next pixel of attention? Ambient motion is being replaced by functional motion — animation that answers 'where am I, and where can I go?' The result is measurable: the quietest dashboards in our Pulse testing held attention 2.3× longer than their loud predecessors.",
    readTime: "6 min",
    date: "Jun 2026",
  },
  {
    id: "design-engineer-spectrum",
    tag: "Craft",
    title: "The design-engineer spectrum is the new full-stack",
    excerpt: "The highest-leverage hire of 2026 isn't a frontend dev or a UI designer. It's both, fused.",
    body: "Full-stack used to mean front and back. Today the most valuable adjacency is design ↔ engineering: the person who can interrogate a user interview at 10am and debug a shader at 4pm. In the teams I've led, that hybrid profile collapsed handoff cycles from weeks to hours. Not because they were faster — because the conversation happened inside the artifact instead of around it. Muse's adoption (96% reuse across 12 teams) was less about the library than about removing the translator between the two disciplines.",
    readTime: "4 min",
    date: "Apr 2026",
  },
  {
    id: "measuring-motion",
    tag: "Performance",
    title: "Measuring motion: animation budgets & INP",
    excerpt: "Every animation I ship carries a performance budget. Here's the ledger I use.",
    body: "Motion is a performance feature. My rule of thumb: 200ms for micro-interactions, 400ms for content reveals, 700ms for stage changes — and every one of them must survive a 60fps frame budget on a mid-range phone. We now track INP as a release gate alongside LCP. The discipline paid off on Aurora: our scroll-choreographed PDP hit 0.9s LCP because the animation timeline was engineered into the render path, not layered on top of it.",
    readTime: "5 min",
    date: "Feb 2026",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Akash.S is the rare engineer who will argue about kerning and sharding in the same breath — and win both arguments. He rebuilt our checkout in six weeks and conversion moved overnight.",
    name: "Priya Nair",
    role: "VP Engineering",
    company: "Northbeam",
  },
  {
    quote:
      "He gave our fintech dashboard something it never had: a point of view. Users stopped calling support because the product finally explains itself.",
    name: "Marcus Feld",
    role: "Chief Product Officer",
    company: "Nova Bank",
  },
  {
    quote:
      "Our platform finally feels like a product, not a prototype. Akash.S's obsession with the last 5% is what separates great engineering from felt engineering.",
    name: "Sofia Reyes",
    role: "Head of Product",
    company: "Helio Health",
  },
  {
    quote:
      "The 60fps globe demo sold our board in four minutes. Nobody asked for a slide deck after that.",
    name: "Daniel Okafor",
    role: "Co-Founder & CEO",
    company: "Opal Labs",
  },
];
