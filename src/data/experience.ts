// ---------------------------------------------------------------------------
// Experience timeline + skill radar data.
// The timeline is deliberately non-linear (horizontal, snap-scrolling) to
// mirror the 2026 "functional motion" brief: navigation that tells a story.
// ---------------------------------------------------------------------------

export interface Role {
  id: string;
  period: string;
  company: string;
  title: string;
  kind: "work" | "education";
  highlights: string[];
  tags: string[];
}

export const timeline: Role[] = [
  {
    id: "northbeam",
    period: "2022 — Now",
    company: "Northbeam",
    title: "Senior Full-Stack Engineer",
    kind: "work",
    highlights: [
      "Owned checkout & billing end-to-end; rearchitected it onto an edge-rendered stack.",
      "Led the 12-person Design Engineering guild — built the motion & a11y standards handbook.",
      "Co-founded the AI copilot program: “Explain this charge” reached 61% of active accounts.",
    ],
    tags: ["Leadership", "Payments", "AI Features"],
  },
  {
    id: "lumen",
    period: "2019 — 2022",
    company: "Lumen Health",
    title: "Product Engineer",
    kind: "work",
    highlights: [
      "Led a 6-person squad rebuilding the patient portal; engagement up 54% within two quarters.",
      "Shipped the HIPAA-compliant video visit flow used by 240+ clinics.",
      "Drove the accessibility audit that earned WCAG 2.1 AA certification for the product suite.",
    ],
    tags: ["Healthcare", "HIPAA", "Squad Lead"],
  },
  {
    id: "pixelform",
    period: "2017 — 2019",
    company: "Pixelform",
    title: "Frontend Engineer",
    kind: "work",
    highlights: [
      "Cut the flagship app's bundle size by 41% through code-splitting and a token-driven theming engine.",
      "Built the in-house charting library that three client products shipped on.",
      "Reduced cross-team review cycles 2.4× by introducing a motion review checklist.",
    ],
    tags: ["Fintech UI", "Performance", "Tooling"],
  },
  {
    id: "vit",
    period: "2013 — 2017",
    company: "VIT Vellore",
    title: "B.Tech, Computer Science",
    kind: "education",
    highlights: [
      "Graduated with a 8.6 CGPA; thesis on gaze-aware interface adaptation (published).",
      "Founded the design club and ran the campus hackathon for two consecutive years.",
      "Won 12 national design & hackathon awards before graduating.",
    ],
    tags: ["HCI Research", "Leadership", "Awards"],
  },
];

/** Hybrid-skill radar: UI/UX ↔ engineering ↔ motion ↔ leadership. */
export const radarSkills = [
  { label: "Frontend", value: 92 },
  { label: "UI / UX", value: 88 },
  { label: "Motion", value: 95 },
  { label: "3D / WebGL", value: 80 },
  { label: "Backend", value: 78 },
  { label: "Design Systems", value: 90 },
  { label: "Accessibility", value: 85 },
  { label: "Leadership", value: 76 },
] as const;

/** "Zero UI" facts revealed on hover/drag of the portrait. */
export const facts = [
  "12× award-winning work",
  "1.4M data tiles served daily",
  "0 hand-offs — design → code solo",
  "14 conference stages",
  "8.2k OSS stars",
  "99 Lighthouse, averaged",
] as const;

export const resumeUrl = "/resume-akash-s-2026.pdf";
