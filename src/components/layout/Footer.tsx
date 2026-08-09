"use client";

// ---------------------------------------------------------------------------
// Footer — the massive final CTA + meta bar.
//  - Giant headline + magnetic social links + nav, accessibility statement
//    overlay, live local time, "Back to top".
//  - The a11y statement opens an overlay dialog with the WCAG 2.2 AA pledge.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { Marquee } from "@/components/ui/Marquee";
import { BackToTop } from "./BackToTop";
import { nav, site, socials, clients } from "@/data/site";
import { useScroll as useLenisScroll } from "@/components/providers/ScrollProvider";

/** Live local time — a tiny "alive" detail in the footer. */
function LiveTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span aria-label={`Local time ${time}`}>{time} IST</span>;
}

/** Accessibility statement overlay — inclusive-design ethics, made public. */
function A11yStatement({ onClose }: { onClose: () => void }) {
  const { lock, unlock } = useLenisScroll();
  useEffect(() => {
    lock();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [lock, unlock, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-modal grid place-items-center bg-bg/70 p-5 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-title"
    >
      <motion.div
        className="w-full max-w-2xl rounded-3xl border border-line/15 bg-surface p-8 md:p-10"
        initial={{ y: 40, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="a11y-title" className="font-display text-2xl font-bold">
          Accessibility Statement
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Akash.dev is designed and maintained against the <strong className="text-ink">WCAG 2.2 AA</strong>{" "}
          success criteria. Concretely, this site commits to:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-ink/90">
          {[
            "Full keyboard operability — every interaction has a visible focus ring and a keyboard path.",
            "prefers-reduced-motion respected — all animation collapses to static, meaningful content.",
            "Adaptive color modes (Light / Dark / System) with AA-contrast palettes in both.",
            "44px minimum touch targets and ARIA-labelled, semantic landmarks throughout.",
            "Screen-reader friendly content: real headings, sr-only descriptions of charts and 3D.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Found something that falls short? I treat every report as a bug ticket — email{" "}
          <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 h-11 rounded-full bg-accent px-6 text-sm font-semibold text-bg shadow-glow-sm transition hover:brightness-110"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Footer() {
  const [showA11y, setShowA11y] = useState(false);
  const { scrollTo } = useLenisScroll();

  return (
    <footer className="relative overflow-hidden pt-28 md:pt-40" aria-labelledby="footer-heading">
      {/* Client wordmark marquee — trust signal */}
      <Marquee items={clients} duration={28} className="border-y border-line/10" />

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* ---- The unmissable final CTA ---- */}
        <h2 id="footer-heading" className="mt-28 text-center type-mega font-display font-extrabold tracking-tight">
          <span className="block">
            Have an idea?
          </span>
          <span className="block">
            <a
              href={`mailto:${site.email}`}
              data-cursor="link"
              className="text-accent underline decoration-accent/30 underline-offset-[0.15em] transition-colors hover:decoration-accent"
            >
              Let&apos;s talk
            </a>{" "}
            about it.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-center text-muted">
          {site.availability} One good conversation is worth a hundred cold pitches.
        </p>

        {/* ---- Social links — magnetic ---- */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {socials.map((s) => (
            <Magnetic key={s.label} strength={22}>
              <a
                href={s.url}
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor="link"
                aria-label={`${s.label}: ${s.handle}`}
                className="flex h-14 items-center gap-3 rounded-full border border-line/15 px-6 font-semibold transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-glow-sm"
              >
                <span aria-hidden className="type-micro text-accent">{s.label}</span>
                {s.handle}
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">↗</span>
              </a>
            </Magnetic>
          ))}
        </div>

        {/* ---- Meta bar ---- */}
        <div className="mt-24 grid grid-cols-1 gap-8 border-t border-line/10 py-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold">Akash.dev</p>
            <p className="mt-2 text-sm text-muted">
              © {new Date().getFullYear()} Akash.S. Designed & engineered with a compiler, a
              coffee machine, and unreasonable standards.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 md:justify-center">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="text-sm text-muted underline decoration-dotted underline-offset-4 transition-colors hover:text-accent"
            >
              Accessibility Statement
            </button>
          </nav>
          <div className="text-left md:text-right">
            <p className="text-sm text-muted">
              <LiveTime />
            </p>
            <p className="mt-2 type-micro text-muted">Built with Next.js · TypeScript · Motion · Three.js</p>
          </div>
        </div>
      </div>

      <BackToTop />

      <AnimatePresence>
        {showA11y && <A11yStatement onClose={() => setShowA11y(false)} />}
      </AnimatePresence>
    </footer>
  );
}