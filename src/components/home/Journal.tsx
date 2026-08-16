// ---------------------------------------------------------------------------
// Journal — homepage teaser linking to the /blog articles. Three cards, each
// targeting a keyword cluster (SaaS development, web development, product
// design) with a strong internal link to the full article.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { posts } from "@/data/posts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Journal() {
  return (
    <section aria-labelledby="journal-heading" className="py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading kicker="07 · The Journal" title={"Writing that\nships with the work"} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line/10 bg-surface p-8 transition-colors duration-300 hover:border-accent/40"
              >
                <div className="flex items-center gap-3 type-micro text-muted">
                  <span>{post.date}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-line/30" />
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
                <p className="mt-6 text-sm font-semibold text-accent">
                  Read the post <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}