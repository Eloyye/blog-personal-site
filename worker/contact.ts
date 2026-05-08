import { contactSchema } from "../app/lib/contact-schema";

import type { Env } from "./index";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAILCHANNELS_SEND_URL = "https://api.mailchannels.net/tx/v1/send";

function stripCRLF(value: string): string {
  return value.replace(/[\r\n]/g, "");
}

type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  "error-codes"?: string[];
};

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
  const data = (await res.json()) as TurnstileVerifyResponse;

  if (!data.success) {
    console.error("Turnstile verification failed", {
      status: res.status,
      errorCodes: data["error-codes"],
      hostname: data.hostname,
      action: data.action,
      challengeTs: data.challenge_ts,
    });
  }

  return data.success;
}

async function sendViaMail(
  env: Env,
  name: string,
  email: string,
  message: string,
): Promise<Response> {
  const payload: Record<string, unknown> = {
    personalizations: [{ to: [{ email: env.CONTACT_TO_EMAIL }] }],
    from: { email: env.MAIL_FROM_ADDRESS, name: "eloyye.com" },
    reply_to: { email },
    subject: stripCRLF(`Contact form: ${name}`),
    content: [{ type: "text/plain", value: message }],
  };

  if (env.DKIM_DOMAIN && env.DKIM_SELECTOR && env.DKIM_PRIVATE_KEY) {
    (payload.personalizations as Array<Record<string, unknown>>)[0].dkim_domain = env.DKIM_DOMAIN;
    (payload.personalizations as Array<Record<string, unknown>>)[0].dkim_selector =
      env.DKIM_SELECTOR;
    (payload.personalizations as Array<Record<string, unknown>>)[0].dkim_private_key =
      env.DKIM_PRIVATE_KEY;
  }

  return fetch(MAILCHANNELS_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const { name, email, message, website, turnstileToken } = parsed.data;

  if (website && website.length > 0) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "0.0.0.0";

  if (!env.TURNSTILE_SECRET) {
    console.error("TURNSTILE_SECRET is not configured");
    return Response.json({ error: "Server configuration error" }, { status: 500 });
  }

  const turnstileOk = await verifyTurnstile(turnstileToken, ip, env.TURNSTILE_SECRET);
  if (!turnstileOk) {
    return Response.json({ error: "Verification failed. Please try again." }, { status: 403 });
  }

  try {
    const mailRes = await sendViaMail(env, name, email, message);
    if (!mailRes.ok) {
      const text = await mailRes.text();
      console.error("MailChannels error:", mailRes.status, text);
      return Response.json(
        { error: "Failed to send message. Please try again later." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Mail send error:", err);
    return Response.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
