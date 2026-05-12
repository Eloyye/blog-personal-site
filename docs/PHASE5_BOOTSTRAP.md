# Phase 5 Bootstrap — RSS, Sitemap, Robots, Open Graph, Analytics, Polish

This document tracks what was implemented for discoverability/shareability, what still requires dashboard setup, and the verification checklist for shipping Phase 5.

---

## What was implemented

### Build outputs

| File                       | Purpose                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `scripts/site-content.ts`  | Shared build-time content collector for published posts, topic paths, and canonical URLs |
| `scripts/build-rss.ts`     | Emits `build/client/rss.xml` after the React Router build                                |
| `scripts/build-sitemap.ts` | Emits `build/client/sitemap.xml` after the React Router build                            |
| `scripts/build-404.ts`     | Copies prerendered `/404` output to `build/client/404.html` for Cloudflare fallback use  |

### SEO and metadata

| File                                  | Purpose                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `app/lib/seo.ts`                      | Shared canonical URL, Open Graph, Twitter card, and default description helpers                    |
| `app/root.tsx`                        | Adds RSS alternate link and removes duplicate fallback `<title>`                                   |
| `app/home.tsx`                        | Uses shared SEO metadata                                                                           |
| `app/routes/work.tsx`                 | Uses shared SEO metadata                                                                           |
| `app/routes/contact.tsx`              | Uses shared SEO metadata                                                                           |
| `app/routes/blog._index.tsx`          | Uses shared SEO metadata                                                                           |
| `app/routes/blog.$topic.tsx`          | Adds canonical topic path metadata                                                                 |
| `app/routes/blog.$topic.$article.tsx` | Adds canonical post metadata, article Open Graph fields, article section, and article tag metadata |
| `public/og-default.webp`              | Default 1200x630 social preview image                                                              |
| `public/og-default.svg`               | Source SVG used to generate `og-default.webp`                                                      |

### Routing and deployment config

| File                     | Change                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `app/routes/$.tsx`       | Catch-all 404 page with a home link                                                                    |
| `app/routes.ts`          | Registers the `*` catch-all route                                                                      |
| `react-router.config.ts` | Adds `/404` to the prerender list                                                                      |
| `package.json`           | Build script now runs React Router build, 404 copy, RSS generation, and sitemap generation             |
| `public/robots.txt`      | Allows all crawlers and points to `https://eloyye.com/sitemap.xml`                                     |
| `public/_headers`        | Adds security headers, report-only CSP, short default caching, and immutable caching for hashed assets |

---

## Generated files

After `bun run build`, these files should exist:

| Output                         | Expected source                                        |
| ------------------------------ | ------------------------------------------------------ |
| `build/client/rss.xml`         | `scripts/build-rss.ts` + `app/content/posts/*.mdx`     |
| `build/client/sitemap.xml`     | `scripts/build-sitemap.ts` + published route inventory |
| `build/client/404.html`        | `scripts/build-404.ts` from prerendered `/404`         |
| `build/client/og-default.webp` | Copied from `public/og-default.webp`                   |
| `build/client/_headers`        | Copied from `public/_headers`                          |
| `build/client/robots.txt`      | Copied from `public/robots.txt`                        |

The RSS feed uses the canonical post URL as `<guid isPermaLink="true">`. Do not reuse slugs for unrelated posts.

---

## Manual setup required

### 1. Cloudflare Web Analytics (manual)

The source code intentionally does not add an analytics script. Cloudflare Pages can inject the beacon for the project domain.

**Steps:**

1. Go to Cloudflare Dashboard → Workers & Pages → project → Analytics.
2. Enable Web Analytics for `eloyye.com`.
3. Deploy the site.
4. Visit the production site once.
5. Confirm events appear in the Web Analytics dashboard.

If Cloudflare does not auto-inject for the current deployment model, use the exact script tag Cloudflare provides for this site token. Do not invent the token in source.

### 2. Sitemap submission (manual)

Submit the generated sitemap after deploying:

| Service               | URL                              |
| --------------------- | -------------------------------- |
| Google Search Console | `https://eloyye.com/sitemap.xml` |
| Bing Webmaster Tools  | `https://eloyye.com/sitemap.xml` |

Keep `public/robots.txt` pointing at the sitemap so crawlers can discover it without console submission.

### 3. Lighthouse/performance pass (manual)

Run Lighthouse against a real Cloudflare preview or production URL, not local dev.

Target pages:

- `/`
- `/blog`
- `/blog/software/hello-world`
- `/contact`

Goal: 100/100/100/100 or document any tradeoff. The contact page may load extra client JavaScript for Turnstile and form validation; evaluate content pages separately from the form page.

### 4. Security headers validation (manual)

After deploy, verify:

- [securityheaders.com](https://securityheaders.com/)
- Browser DevTools network headers for HTML and `/assets/*`
- Contact form still loads Turnstile with the report-only CSP
- Cloudflare Web Analytics still records traffic with the report-only CSP

The current CSP is `Content-Security-Policy-Report-Only` on purpose. Enforce only after Turnstile and analytics have been verified in production.

---

## Testing checklist

- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes with 0 warnings
- [ ] `bun run format` passes
- [ ] `bun run test` passes
- [ ] `bun run build` emits `rss.xml`, `sitemap.xml`, and `404.html`
- [ ] `build/client/rss.xml` contains only published, non-future posts
- [ ] `build/client/rss.xml` item links use `/blog/<topic>/<slug>`
- [ ] `build/client/sitemap.xml` includes `/`, `/work`, `/contact`, `/blog`, active topic pages, and canonical post URLs
- [ ] `build/client/index.html` has one `<title>`, canonical URL, default OG image, Twitter card metadata, and RSS alternate link
- [ ] `build/client/blog/software/hello-world/index.html` has article OG metadata and canonical URL
- [ ] `build/client/404.html` exists at the output root
- [ ] `build/client/_headers` contains short default cache and immutable `/assets/*` cache
- [ ] `build/client/robots.txt` points to `https://eloyye.com/sitemap.xml`
- [ ] Production deploy serves `/rss.xml`
- [ ] Production deploy serves `/sitemap.xml`
- [ ] Production deploy serves `/og-default.webp`
- [ ] Unknown production URLs serve the custom 404 page

---

## Architecture notes

### Why feed generation uses filesystem scripts

The app content loader uses Vite's `import.meta.glob`, which is correct for React Router routes but not portable to standalone Bun scripts. Phase 5 uses `scripts/site-content.ts` to read MDX frontmatter directly with `gray-matter` so RSS and sitemap generation run after the production build without relying on Vite internals.

### Published content policy

RSS, sitemap, and prerendering all exclude:

- `draft: true`
- future-dated posts

This keeps unpublished content out of production discovery surfaces.

### 404 output

React Router prerenders `/404` to `build/client/404/index.html`. Cloudflare expects a root `404.html` fallback file, so `scripts/build-404.ts` copies that prerendered page to `build/client/404.html` after build.

### Headers

Cloudflare Pages `_headers` rules inherit across matching rules. The `/assets/*` rule uses `! Cache-Control` before setting immutable caching so hashed assets do not inherit the global short cache rule.

### Open Graph images

The default OG image is static and committed as `public/og-default.webp`. Per-post images can be added later by setting `ogImage` in MDX frontmatter to a public path or absolute URL.

Crawler caches are sticky. If the default OG image changes, consider changing the image URL or using platform debuggers to refresh cached previews.

---

## Not implemented in source

- Cloudflare Web Analytics dashboard enablement
- Search Console / Bing sitemap submission
- Production Lighthouse audit
- Enforced CSP
- Automated per-post OG image generation with `satori`/`@resvg/resvg-js`

These are intentionally left as deploy-time or future-phase tasks.
