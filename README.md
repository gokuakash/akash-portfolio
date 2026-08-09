# Akash.dev — 2026 Portfolio

A production-grade, single-page portfolio for **Akash Verma** — full-stack engineer ×
product designer. Built on the 2026 design brief: minimalist brutalism, kinetic
typography, functional motion, glassmorphism, and quantifiable storytelling.

## Stack

| Layer          | Choice                                       |
| -------------- | -------------------------------------------- |
| Framework      | Next.js 15 (App Router, SSR)                  |
| Language       | TypeScript (strict)                           |
| Styling        | Tailwind CSS 3 + CSS custom-property tokens   |
| Motion         | Motion (Framer Motion 12) + Lenis smooth scroll |
| 3D             | React Three Fiber + Three.js (hero, WebGL distortion thumbnails) |
| Charts         | d3-shape / d3-scale (skills radar, KPIs)       |
| CMS            | Sanity (optional — local content fallback ships in-repo) |
| Fonts          | Inter, Syne, Fraunces (self-hosted via `next/font`) |

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-checked)
npm run typecheck  # tsc --noEmit
```

## Headless CMS (optional)

Copy `.env.example` → `.env.local` and add a Sanity project id. Every content
getter in `src/lib/cms/` falls back to the seeded copy in `src/data/` when
credentials are absent — the build never breaks.

## Architecture notes

- `src/data/` — all copy & content (projects, timeline, skills, testimonials).
- `src/components/ui/` — primitive controls (Magnetic, Button, Marquee, Counter…).
- `src/components/three/` — WebGL pieces (particle shader hero, thumbnail distortion).
- `src/components/home/` — page sections incl. the Project Deep-Dive modal.
- `src/components/layout/` — sidebar nav, mobile menu, mega footer.
- `src/app/api/contact/` — validated contact endpoint (wire any email provider via `CONTACT_WEBHOOK_URL`).

## Accessibility

WCAG 2.2 AA: skip link, keyboard path for every interaction, focus-visible rings,
`prefers-reduced-motion` kill-switch, 44px touch targets, sr-only chart/3D
descriptions, live-region form validation. Statement in the footer.

## Performance budget

- Hero ships text-only; WebGL mounts lazily behind it (and fully off on touch/low-power).
- All fonts self-hosted via `next/font`; images are SVG posters (zero payload).
- Lenis + motion run on springs; 3D scene checks mobile CoRe count before mounting.