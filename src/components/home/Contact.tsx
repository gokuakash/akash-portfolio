"use client";

// ---------------------------------------------------------------------------
// Contact — interactive form with floating labels, real-time validation,
// and a "paper plane" success animation. Grid-based, uncluttered layout.
// Submits to /api/contact (wire any email provider via CONTACT_WEBHOOK_URL);
// validates before sending with field-level, announce-able errors.
// ---------------------------------------------------------------------------

import { motion, AnimatePresence } from "motion/react";
import { useState, type FormEvent } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/data/site";

interface FormState {
  name: string;
  email: string;
  budget: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = { name: "", email: "", budget: "", message: "" };

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Please tell me your name.";
  if (!form.email.trim()) {
    errors.email = "An email is required to reply.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "That email doesn't look right yet.";
  }
  if (!form.message.trim() || form.message.trim().length < 20) {
    errors.message = "Give me at least a sentence or two (20+ characters).";
  }
  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // Live re-validation: clear the error as soon as it's fixed.
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setForm(INITIAL);
    setErrors({});
    setStatus("idle");
  };

  const field = (key: keyof FormState, label: string, type = "text", rows?: number) => (
    <div className="relative">
      <input
        id={`f-${key}`}
        type={type}
        value={form[key]}
        onChange={set(key)}
        placeholder=" "
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `err-${key}` : undefined}
        className="peer h-14 w-full rounded-xl border border-line/15 bg-bg/50 px-4 pt-4 text-ink outline-none transition-colors duration-300 focus:border-accent"
        autoComplete={key === "email" ? "email" : key === "name" ? "name" : "off"}
      />
      <label
        htmlFor={`f-${key}`}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest"
      >
        {label}
      </label>
      {errors[key] && (
        <p id={`err-${key}`} role="alert" className="mt-1.5 text-xs font-medium text-accent">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Massive contact headline — the unmissable CTA */}
        <h2 id="contact-heading" className="type-mega font-display font-extrabold tracking-tight">
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span className="block" initial={{ y: "110%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              Let&apos;s build
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span className="block text-accent" initial={{ y: "110%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
              something iconic.
            </motion.span>
          </span>
        </h2>

        <p className="type-lede mt-8 max-w-2xl text-muted">
          Have a product in mind, a team that needs a design engineer, or a conference stage
          that needs a story? {site.availability}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* ---- Form ---- */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-accent/30 bg-surface p-10 text-center"
                  role="status"
                >
                  {/* Paper plane taking off — the success animation */}
                  <svg viewBox="0 0 120 60" className="h-16 w-40" aria-hidden>
                    <motion.path
                      d="M2 46 L118 6 L74 54 L56 32 Z"
                      fill="none"
                      stroke="rgb(var(--accent))"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M56 32 L118 6 L74 54"
                      fill="none"
                      stroke="rgb(var(--accent))"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                    />
                    {/* Dash trail */}
                    <motion.circle
                      r="1.6"
                      fill="rgb(var(--accent))"
                      initial={{ cx: 8, cy: 46, opacity: 1 }}
                      animate={{ cx: 110, cy: 10, opacity: [1, 1, 0] }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                  <h3 className="mt-6 font-display text-2xl font-bold">Message is airborne. ✈</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    Thanks, {form.name.split(" ")[0] || "friend"} — I read every message myself
                    and reply within 48 hours.
                  </p>
                  <button type="button" onClick={reset} className="mt-8 h-11 rounded-full border border-line/20 px-6 text-sm font-semibold transition-colors hover:border-accent hover:text-accent">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                  aria-label="Contact form"
                >
                  {field("name", "Your name")}
                  {field("email", "Email address", "email")}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <select
                        id="f-budget"
                        value={form.budget}
                        onChange={set("budget")}
                        aria-label="Project budget"
                        className="peer h-14 w-full appearance-none rounded-xl border border-line/15 bg-bg/50 px-4 pt-4 text-ink outline-none transition-colors duration-300 focus:border-accent"
                      >
                        <option value="">Open to discuss</option>
                        <option value="10-25k">$10k – $25k</option>
                        <option value="25-75k">$25k – $75k</option>
                        <option value="75k+">$75k+</option>
                      </select>
                      <label htmlFor="f-budget" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted transition-all duration-300 peer-focus:top-3 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-accent">
                        Project budget
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="relative">
                      <textarea
                        id="f-message"
                        value={form.message}
                        onChange={set("message")}
                        placeholder=" "
                        rows={4}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "err-message" : undefined}
                        className="peer w-full rounded-xl border border-line/15 bg-bg/50 px-4 pb-3 pt-6 text-ink outline-none transition-colors duration-300 focus:border-accent"
                      />
                      <label htmlFor="f-message" className="pointer-events-none absolute left-4 top-5 text-sm text-muted transition-all duration-300 peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest">
                        Tell me about the problem
                      </label>
                    </div>
                    {errors.message && (
                      <p id="err-message" role="alert" className="mt-1.5 text-xs font-medium text-accent">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {status === "error" && (
                    <p role="alert" className="md:col-span-2 text-xs text-accent">
                      Something went wrong on the wire. Email me directly at {site.email} — or try again.
                    </p>
                  )}

                  <Magnetic className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      data-cursor="link"
                      className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-accent px-8 font-semibold text-bg shadow-glow transition-all duration-300 hover:brightness-110 disabled:opacity-60"
                    >
                      {status === "sending" ? (
                        <>
                          <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-bg/40 border-t-bg" />
                          Launching…
                        </>
                      ) : (
                        <>
                          Send message
                          <span aria-hidden>→</span>
                        </>
                      )}
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ---- Direct channels ---- */}
          <div className="lg:col-span-5">
            <h3 className="type-micro text-muted">Or reach me directly</h3>
            <ul className="mt-6 space-y-4">
              {[
                { label: "Email", value: site.email, href: `mailto:${site.email}` },
                { label: "GitHub", value: "github.com/akashverma", href: "https://github.com/akashverma" },
                { label: "LinkedIn", value: "linkedin.com/in/akash-verma", href: "https://linkedin.com/in/akash-verma" },
                { label: "X / Twitter", value: "@akashbuilds", href: "https://x.com/akashbuilds" },
              ].map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    data-cursor="link"
                    className="group flex items-center justify-between rounded-2xl border border-line/10 bg-surface p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-glow-sm"
                  >
                    <div>
                      <p className="type-micro text-muted">{c.label}</p>
                      <p className="mt-1 font-medium text-ink group-hover:text-accent transition-colors">{c.value}</p>
                    </div>
                    <span aria-hidden className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted">
              Timezone-friendly: I&apos;m in <span className="font-semibold text-ink">UTC+5:30</span>, and happy
              to overlap with US/EU mornings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}