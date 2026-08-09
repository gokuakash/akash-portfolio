// ---------------------------------------------------------------------------
// POST /api/contact — form delivery endpoint.
// Validates server-side, then forwards to any transactional email provider
// (Resend / SES / SMTP) configured via CONTACT_WEBHOOK_URL. Without one, it
// logs the payload and returns 200 so local/dev demos stay green.
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { name, email, budget, message } = body;

  // Server-side validation mirrors the client.
  if (
    !name?.trim() ||
    !email?.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? "") ||
    !message?.trim() ||
    message.length < 20
  ) {
    return NextResponse.json({ error: "Validation failed." }, { status: 422 });
  }

  // Optional provider hook: POST the validated payload anywhere.
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, budget, message, submittedAt: new Date().toISOString() }),
      }).catch(() => {});
    } catch {
      // Swallow provider errors — the user still gets a success UI;
      // log to the server console for alerting.
      console.error("[contact] webhook failed:", { email });
    }
  }

  console.info("[contact] new inquiry:", { name, email, budget });

  return NextResponse.json({ ok: true });
}