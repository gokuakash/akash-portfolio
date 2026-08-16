// ---------------------------------------------------------------------------
// Article reader — one indexed URL per post with its own title, description,
// canonical and Article structured data. Author links to the Person schema
// on the home page (@id is reused, so Google ties author to site owner).
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/data/posts";
import { site } from "@/data/site";
import { PostBlock } from "@/data/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
    openGraph: {
      type: "article",
      locale: "en_IN",
      title: `${post.title} · ${site.fullName}`,
      description: post.description,
      url: `${site.domain}/blog/${post.slug}`,
      images: [{ url: "/images/og.png", width: 1200, height: 630, alt: site.tagline }],
      publishedTime: post.date,
      authors: [site.domain],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · ${site.fullName}`,
      description: post.description,
    },
  };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.t) {
    case "h2":
      return <h2 className="mt-12 font-display text-2xl font-bold leading-snug md:text-3xl">{block.x}</h2>;
    case "ul":
      return (
        <ul className="mt-6 space-y-3">
          {block.x.map((item) => (
            <li key={item} className="flex gap-3 text-muted type-lede">
              <span aria-hidden className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-accent pl-6 font-serif text-xl italic leading-relaxed text-ink md:text-2xl">
          {block.x}
        </blockquote>
      );
    default:
      return <p className="mt-6 text-muted type-lede">{block.x}</p>;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    keywords: post.tags,
    url: `${site.domain}/blog/${post.slug}`,
    image: `${site.domain}/images/og.png`,
    author: { "@id": `${site.domain}/#person` },
    publisher: { "@id": `${site.domain}/#person` },
    mainEntityOfPage: `${site.domain}/blog/${post.slug}`,
  };

  return (
    <main className="relative pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-5 md:px-10">
        <Link href="/blog" className="type-micro text-muted transition-colors hover:text-accent">
          ← The Journal
        </Link>

        <h1 className="mt-8 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-3 type-micro text-muted">
          <span className="font-semibold text-ink">{site.fullName}</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-line/30" />
          <span>{post.date}</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-line/30" />
          <span>{post.readingTime}</span>
        </div>

        <div className="mt-10 border-t border-line/10 pt-10">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-line/15 px-3 py-1 text-xs text-muted">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-line/10 bg-surface p-8 text-center">
          <p className="font-serif text-xl italic text-ink">
            Need this kind of thinking on your product?
          </p>
          <p className="mt-3 text-sm text-muted">
            Call or WhatsApp{" "}
            <a href={site.phoneHref} className="font-semibold text-accent">
              {site.phone}
            </a>{" "}
            — quick assistance or a full build, usually replies within an hour.
          </p>
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}