// ---------------------------------------------------------------------------
// Home page — the scrollytelling assembly:
// Hero → About → Projects → Experience → Insights → Testimonials → Footer(CTA).
// Every section is a named landmark with an h1 (hero) and h2 chain, so the
// outline is screen-reader friendly and SEO-correct.
// ---------------------------------------------------------------------------

import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Projects } from "@/components/home/Projects";
import { Experience } from "@/components/home/Experience";
import { Insights } from "@/components/home/Insights";
import { Testimonials } from "@/components/home/Testimonials";
import { Journal } from "@/components/home/Journal";
import { Contact } from "@/components/home/Contact";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Experience />
      {/* Mini service strip — typed in the "Services" nod of the brief */}
      <section aria-labelledby="services-heading" className="py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <SectionHeading kicker="06 · Discipline" title={"Design, code &\nmotion, one contract"} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Design Engineering",
                body: "Interfaces built by the person who designed them — tokens, motion specs and accessibility shipped in the same commit.",
              },
              {
                n: "02",
                title: "Full-Stack Systems",
                body: "Edge rendering, typed APIs, data pipelines and observability. The parts users never see, done with the same care.",
              },
              {
                n: "03",
                title: "3D & Motion",
                body: "WebGL scenes and choreographed animation with declared performance budgets — 60fps or it doesn't ship.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="group h-full rounded-3xl border border-line/10 bg-surface p-8 transition-colors duration-300 hover:border-accent/40">
                  <p className="font-display text-3xl font-extrabold text-accent">{s.n}</p>
                  <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Insights />
      <Testimonials />
      <Journal />
      <Contact />
    </>
  );
}