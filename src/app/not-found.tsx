import Link from "next/link";

// ---------------------------------------------------------------------------
// 404 — on-brand, but honest: the link invites a conversation instead.
// ---------------------------------------------------------------------------

export default function NotFound() {
  return (
    <div className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">
          This page drifted off the grid.
        </h1>
        <p className="mt-3 max-w-md text-muted">
          Like a KPI during a bad sprint, it&apos;s gone. The good news: the portfolio is a
          single scroll away.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-14 items-center rounded-full bg-accent px-8 font-semibold text-bg shadow-glow transition hover:brightness-110"
        >
          Back to the work
        </Link>
      </div>
    </div>
  );
}