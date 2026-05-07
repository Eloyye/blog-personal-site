# Phase 4 Bootstrap — Contact Form + MailChannels + Turnstile

This document tracks what was implemented, what requires manual setup before the contact form is fully operational, and known blockers.

---

## What was implemented

### Client side

| File                                     | Purpose                                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `app/routes/contact.tsx`                 | Contact page route with meta tags                                                                                |
| `app/components/contact/ContactForm.tsx` | Form with name/email/message fields, honeypot, Turnstile widget, client-side Zod validation, toast notifications |
| `app/components/contact/Turnstile.tsx`   | Explicit-render Turnstile widget wrapper                                                                         |
| `app/lib/contact-schema.ts`              | Zod schema shared between client and Worker                                                                      |
| `app/components/ui/input.tsx`            | shadcn Input component                                                                                           |
| `app/components/ui/textarea.tsx`         | shadcn Textarea component                                                                                        |
| `app/components/ui/label.tsx`            | shadcn Label component                                                                                           |
| `app/components/ui/sonner.tsx`           | Toast provider (adapted from shadcn, uses project theme system instead of next-themes)                           |

### Server side (Cloudflare Worker)

| File                   | Purpose                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `worker/index.ts`      | Worker entry point — routes `/api/contact` POST to the handler, falls through to static assets for everything else |
| `worker/contact.ts`    | Validates with Zod, rejects honeypot, verifies Turnstile token, sends email via MailChannels API                   |
| `worker/tsconfig.json` | Separate TypeScript config for `@cloudflare/workers-types`                                                         |

### Configuration changes

| File                                  | Change                                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `app/routes.ts`                       | Added `/contact` route                                                                    |
| `react-router.config.ts`              | Added `/contact` to prerender list                                                        |
| `wrangler.jsonc`                      | Added `main: "worker/index.ts"` and `assets.binding: "ASSETS"` for Worker + static assets |
| `package.json`                        | Added `zod`, `sonner`, `@cloudflare/workers-types`; updated typecheck script              |
| `app/components/layout/HeaderNav.tsx` | Added Contact to nav                                                                      |
| `app/components/layout/Footer.tsx`    | Changed Contact mailto to a `<Link to="/contact">`                                        |
| `dev.vars.example`                    | Template for local environment variables (copy to `.dev.vars`)                            |

---

## Blockers — manual setup required

### 1. Turnstile site key and secret (BLOCKER)

The form will not submit without a configured Turnstile widget.

**Steps:**

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) → **Add site**
2. Enter `eloyye.com` as the domain (add `localhost` for local dev)
3. Choose widget type: **Managed** (recommended)
4. Copy the **Site Key** and **Secret Key**
5. Set the site key as a Vite env var so it's available at build time:
   - For local dev: create a `.env` file at project root with `VITE_TURNSTILE_SITE_KEY=<site-key>`
   - For production: set `VITE_TURNSTILE_SITE_KEY` in the Cloudflare Pages build environment
6. Set the secret as a Worker env var (never exposed to client):
   - For local dev: copy `.dev.vars.example` to `.dev.vars` and fill in `TURNSTILE_SECRET`
   - For production: set `TURNSTILE_SECRET` in Cloudflare dashboard → Workers & Pages → personal-site → Settings → Variables

### 2. MailChannels availability (POTENTIAL BLOCKER)

The Worker sends email via `https://api.mailchannels.net/tx/v1/send`. MailChannels previously offered a free transactional email API for Cloudflare Workers, but **availability has changed over time**.

**Before relying on MailChannels, verify:**

- Visit [mailchannels.com](https://www.mailchannels.com/) and confirm the free Cloudflare Workers integration is still active
- If MailChannels is no longer free or available, consider alternatives:
  - **Resend** ([resend.com](https://resend.com)) — 100 emails/day free, simple REST API
  - **SendGrid** — 100 emails/day free tier
  - **Postmark** — developer-friendly, free trial
  - **Amazon SES** — very cheap at scale

To swap providers, update `worker/contact.ts` — replace the `sendViaMail` function with the chosen provider's API call. The rest of the handler (validation, Turnstile, honeypot) is provider-agnostic.

### 3. DNS records (BLOCKER for email deliverability)

Without proper DNS records, emails sent from `eloyye.com` will land in spam or be rejected entirely.

**Required records on `eloyye.com`:**

| Type | Name            | Value                                           | Purpose                                                                                                                                |
| ---- | --------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| TXT  | `@`             | `v=spf1 include:relay.mailchannels.net ~all`    | SPF — authorizes MailChannels to send on your behalf. **Merge** with any existing SPF record (only one SPF record allowed per domain). |
| TXT  | `_mailchannels` | `v=mc1 cfid=<your-pages-project>.pages.dev`     | MailChannels domain lockdown — prevents spoofing. Replace `<your-pages-project>` with your actual Pages/Workers subdomain.             |
| TXT  | `_dmarc`        | `v=DMARC1; p=none; rua=mailto:hello@eloyye.com` | DMARC — start with `p=none` for monitoring, tighten to `p=quarantine` or `p=reject` after confirming legitimate mail passes.           |

**Strongly recommended (DKIM):**

1. Generate an RSA keypair (2048-bit):
   ```bash
   openssl genrsa -out dkim_private.pem 2048
   openssl rsa -in dkim_private.pem -pubout -out dkim_public.pem
   ```
2. Publish the public key as a TXT record:
   - Name: `s1._domainkey`
   - Value: `v=DKIM1; k=rsa; p=<base64-public-key-single-line>`
3. Set Worker env vars:
   - `DKIM_DOMAIN=eloyye.com`
   - `DKIM_SELECTOR=s1`
   - `DKIM_PRIVATE_KEY=<base64-encoded-private-key>`

### 4. Worker environment variables (BLOCKER)

The Worker expects these env vars. Without them, the `/api/contact` endpoint returns 500.

| Variable            | Required | Where to set                                 | Description                                  |
| ------------------- | -------- | -------------------------------------------- | -------------------------------------------- |
| `TURNSTILE_SECRET`  | Yes      | `.dev.vars` (local), Workers Settings (prod) | Turnstile secret key                         |
| `CONTACT_TO_EMAIL`  | Yes      | `.dev.vars` (local), Workers Settings (prod) | Destination email (e.g., `hello@eloyye.com`) |
| `MAIL_FROM_ADDRESS` | Yes      | `.dev.vars` (local), Workers Settings (prod) | Sender address (e.g., `noreply@eloyye.com`)  |
| `DKIM_DOMAIN`       | No       | `.dev.vars` (local), Workers Settings (prod) | e.g., `eloyye.com`                           |
| `DKIM_SELECTOR`     | No       | `.dev.vars` (local), Workers Settings (prod) | e.g., `s1`                                   |
| `DKIM_PRIVATE_KEY`  | No       | `.dev.vars` (local), Workers Settings (prod) | Base64-encoded DKIM private key              |

### 5. Client build-time env var (BLOCKER)

| Variable                  | Where to set                                     | Description                              |
| ------------------------- | ------------------------------------------------ | ---------------------------------------- |
| `VITE_TURNSTILE_SITE_KEY` | `.env` (local), Cloudflare build settings (prod) | Turnstile site key for the client widget |

---

## Testing checklist

After completing the setup above:

- [ ] `bun run build` succeeds and `/contact` is prerendered
- [ ] `bun run preview` serves the contact page locally
- [ ] Turnstile widget renders on the contact page
- [ ] Empty form submission shows client-side validation errors
- [ ] Honeypot field is invisible to real users
- [ ] Valid form submission hits `/api/contact` and returns 200
- [ ] Email arrives in your inbox from `noreply@eloyye.com`
- [ ] Reply-To on received email is set to the submitter's address
- [ ] Test at [mail-tester.com](https://www.mail-tester.com/) for deliverability score ≥ 9/10
- [ ] Toast notification appears on success/error
- [ ] "Send another message" button resets the form after success
- [ ] Double-submit is prevented (button disabled while in-flight)

---

## Architecture notes

### Why a Worker entry instead of Pages Functions

The project deploys via `wrangler deploy` (Workers with static assets), not `wrangler pages deploy`. In this model, there is no `functions/` directory convention. Instead, `worker/index.ts` acts as the entry point — it handles `/api/contact` and delegates everything else to `env.ASSETS.fetch()` for static file serving.

The PLAN.md originally specified `functions/api/contact.ts` (Pages Functions convention). This implementation achieves the same result using the Worker entry point to match the existing deployment model.

### Rate limiting (not yet implemented)

The plan mentions rate limiting (5/hour/IP) via KV or the Workers Rate Limiting API. This is deferred because:

- It requires a KV namespace binding or the Rate Limiting API (paid)
- For a personal site, Turnstile + honeypot is usually sufficient
- If spam becomes an issue, add a KV-based counter keyed by `CF-Connecting-IP`

### Bundle size

The contact page chunk is ~103KB (29KB gzipped), mostly from Zod. This is acceptable since the chunk is lazily loaded only when visiting `/contact`. If size becomes a concern, Zod validation could be replaced with manual checks on the client side (keep Zod in the Worker where bundle size doesn't matter).
