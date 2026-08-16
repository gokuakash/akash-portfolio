// ---------------------------------------------------------------------------
// Blog index — the Journal. Cards link to full articles; each article is its
// own indexed URL, so every post can rank for its keyword cluster.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/data/posts";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Journal — Web Development, Product Design & SaaS Notes",
  description:
    "Writing on web development, web design, product design and SaaS development from Akash.S — performance checklists, architecture notes and design lessons.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <main className="relative pt-32 md:pt-40">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <p className="type-micro text-muted">The Journal</p>
        <h1 className="type-hero font-display font-extrabold tracking-tight">
          Notes on building,
          <br />
          <span className="font-serif font-light italic text-accent">designing & shipping</span>
        </h1>
        <p className="mt-6 max-w-2xl text-muted type-lede">
          Practical writing on web development, product design and SaaS development —
          the checklists I run, the architecture decisions I make, and the lessons
          interfaces have taught me.
        </p>

        <div className="mt-14 space-y-4">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-3xl border border-line/10 bg-surface p-7 transition-colors duration-300 hover:border-accent/40 md:p-9"
            >
              <div className="flex flex-wrap items-center gap-3 type-micro text-muted">
                <span>{post.date}</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-line/30" />
                <span>{post.readingTime}</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-line/30" />
                <span className="text-accent">0{i + 1}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold leading-snug transition-colors duration-300 group-hover:text-accent md:text-3xl">
                {post.title}
              </h2>
              <p className="mt-3 text-muted type-lede">{post.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line/15 px-3 py-1 text-xs text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-16 text-sm text-muted">
          Want this kind of thinking applied to your product?{" "}
          <Link href="/#contact" className="font-semibold text-accent underline underline-offset-4">
            Get in touch
          </Link>{" "}
          — or reach me directly at {site.phone}.
        </p>
      </div>
    </main>
  );
}