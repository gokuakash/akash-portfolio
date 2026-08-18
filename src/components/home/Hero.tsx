"use client";

// ---------------------------------------------------------------------------
// Hero — full-page immersive introduction.
//  - Text-only first paint (fast LCP): the headline uses kinetic masked lines
//    with a rotating role word; the 3D background fades in behind once ready.
//  - WebGL particle field + distorted orb rendered by <HeroScene>; mounted
//    only when `canRunWebGL()` — CSS `.hero-aura` glow is the fallback.
//  - Secondary content (metrics strip, scroll cue) stays hidden until the
//    user scrolls — the "clean initial load" brief.
// ---------------------------------------------------------------------------

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { KineticText } from "@/components/ui/KineticText";
import { Counter } from "@/components/ui/Counter";
import { metrics } from "@/data/site";
import { canRunWebGL, canRunMobileWebGL } from "@/lib/utils";
import { useHydratedEnv } from "@/lib/hooks";
import { useScroll as useLenisScroll } from "@/components/providers/ScrollProvider";

// 3D canvas loads only after the main bundle → zero LCP cost.
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null },
);

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false, loading: () => null },
);

const ROLES = ["interfaces that convert", "systems that scale", "motion that matters", "products people love"];

export function Hero() {
  const { scrollY } = useScroll();
  const { scrollTo } = useLenisScroll();
  // Hydration-safe WebGL gate: false during SSR and the first client render
  // (so the tree matches), then mounts the canvas after hydration.
  // Desktop (fine pointer) gets the full scene; capable phones get a budgeted
  // one — see `mobile`. Everyone else gets the CSS `.hero-aura` fallback.
  const hydrated = useHydratedEnv();
  const desktopWebGL = hydrated && canRunWebGL();
  const isWebGL = desktopWebGL || (hydrated && canRunMobileWebGL());
  const mobile = isWebGL && !desktopWebGL;

  // Scrollytelling: hero content drifts up + fades as the user scrolls.
  const contentY = useTransform(scrollY, [0, 700], [0, -120]);
  const contentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const glowOpacity = useTransform(scrollY, [0, 500], [1, 0.25]);
  // Metrics strip fades in only after the user initiates scroll.
  const metricsOpacity = useTransform(scrollY, [200, 600], [0, 1]);

  return (
    <section
      id="story"
      aria-label="Introduction"
      className="noise relative grid min-h-[100svh] place-items-center overflow-hidden grid-paper"
    >
      {/* Ambient hero glow — always present (WebGL fallback + depth) */}
      <motion.div aria-hidden className="hero-aura absolute inset-0" style={{ opacity: glowOpacity }} />

      {/* Lazy WebGL scene */}
      {isWebGL && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.5 }}
        >
          <Canvas
            dpr={mobile ? [1, 1.25] : [1, 1.75]}
            gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
            camera={{ position: [0, 0, mobile ? 7.5 : 6], fov: mobile ? 60 : 45 }}
          >
            <HeroScene mobile={mobile} />
          </Canvas>
        </motion.div>
      )}

      {/* Foreground content */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Glass identity chip — the first thing on the site. Frosted pill
            over the 3D, monogram + role, short version on phones. */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <span className="glass inline-flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 md:pr-5">
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-bg"
            >
              AK
            </span>
            <span className="type-micro text-ink">
              Akash.S —{" "}
              <span className="hidden sm:inline">Web Developer · Web Designer · Website Creator</span>
              <span className="sm:hidden">Web · Design · Sites</span>
            </span>
          </span>
        </motion.div>

        {/* Kinetic headline: name fixed, value proposition rotates */}
        <h1 className="type-hero font-display font-extrabold tracking-tight">
          <motion.span
            className="block overflow-hidden"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Akash.S
          </motion.span>
          <motion.span
            className="block overflow-hidden"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            builds
          </motion.span>
          {/* Fixed-height slot so the headline never jumps as words rotate.
              xl+: with the vh-capped size the longest role fits one line, so
              1.5em suffices; below xl (narrow windows can wrap to 2 lines)
              the full 2em reserves the space. */}
          <KineticText
            words={ROLES}
            className="block min-h-[2em] font-serif font-light italic text-accent xl:min-h-[1.5em]"
          />
        </h1>

        <motion.p
          className="type-lede mt-8 max-w-xl text-muted"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Eight years turning ambiguous problems into measurable product outcomes — with a
          designer's eye for the last 5%.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button size="lg" href="#work" onClick={(e) => { e.preventDefault(); scrollTo("#work"); }}>
            View My Work
            <span aria-hidden>→</span>
          </Button>
          <Button size="lg" variant="outline" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}>
            Start a Conversation
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue — masked line that fills, guiding the eye down */}
      <motion.a
        href="#work"
        onClick={(e) => { e.preventDefault(); scrollTo("#work", 0); }}
        className="group absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ opacity: contentOpacity }}
        aria-label="Scroll down to see selected work"
        data-cursor="drag"
      >
        <span className="flex flex-col items-center gap-3">
          <span className="type-micro text-muted transition-colors group-hover:text-ink">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-line/20" aria-hidden>
            <span className="absolute inset-0 origin-top animate-scroll-fill bg-accent" />
          </span>
        </span>
      </motion.a>

      {/* Metrics strip — revealed only after the user commits to scrolling.
          Positioned high enough (md:bottom-32) to never collide with the
          scroll cue sitting at the very bottom edge. */}
      <motion.dl
        className="absolute bottom-36 left-1/2 z-10 grid w-full max-w-6xl -translate-x-1/2 grid-cols-2 gap-x-6 gap-y-6 px-6 md:bottom-32 md:grid-cols-4 md:gap-6 md:px-10"
        style={{ opacity: metricsOpacity }}
      >
        {metrics.map((m) => (
          <div key={m.label} className="border-l border-line/15 pl-4">
            <dd className="font-display text-2xl font-bold md:text-3xl">
              <Counter value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
            </dd>
            <dt className="type-micro mt-2 text-muted">{m.label}</dt>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}