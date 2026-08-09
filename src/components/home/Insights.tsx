"use client";

// ---------------------------------------------------------------------------
// Insights — "Industry Insights" mini-blog (thought leadership).
// Cards expand inline via native <details> (accessible by default: keyboard,
// screen readers, no JS required). Cursor morphs to "view" on cards.
// ---------------------------------------------------------------------------

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { insights } from "@/data/insights";

export function Insights() {
  return (
    <section id="insights" aria-labelledby="insights-heading" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          kicker="04 · Field Notes"
          title={"Thinking out loud,\nin public"}
          accent="essays on craft."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {insights.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <details className="group h-full rounded-3xl border border-line/10 bg-surface p-7 transition-colors duration-300 hover:border-accent/40">
                <summary
                  data-cursor="view"
                  className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden"
                >
                  <div>
                    <p className="type-micro text-accent">
                      {post.tag} · {post.readTime} read
                    </p>
                    <h3 className="mt-3 font-display text-xl font-bold leading-snug group-open:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                  </div>
                  <span aria-hidden className="mt-1 text-accent transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-5 border-t border-line/10 pt-5 text-sm leading-relaxed text-ink/85">
                  {post.body}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}