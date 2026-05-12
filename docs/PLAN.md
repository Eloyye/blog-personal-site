# Personal Site — Implementation Plan

A comprehensive build plan for `eloyye.com`: a personal site with About, Work, Contact, and an MDX-powered blog. Optimized for low operational cost via Cloudflare's free tier.

---

## 1. Stack Summary

| Layer                     | Choice                                       | Notes                             |
| ------------------------- | -------------------------------------------- | --------------------------------- |
| Package manager / runtime | Bun                                          | Fast installs, native TS          |
| Build tool                | Vite                                         | RR7's official build pipeline     |
| Framework                 | React Router v7 (SSG / prerender mode)       | Full static output                |
| Language                  | TypeScript (strict)                          |                                   |
| UI primitives             | shadcn/ui                                    | Copy-in components, owned by repo |
| Styling                   | Tailwind CSS v4                              | Utility-first                     |
| Content                   | MDX (`.mdx` in repo)                         | Posts + Projects                  |
| MDX bundler               | `@mdx-js/rollup` via Vite                    |                                   |
| Syntax highlight          | `rehype-pretty-code` (Shiki under the hood)  | Build-time, zero runtime JS       |
| Hosting                   | Cloudflare Pages (static)                    | Free tier                         |
| Contact form backend      | Cloudflare Worker + Cloudflare Email Service | Native Worker email binding       |
| Spam protection           | Cloudflare Turnstile                         | Free, privacy-friendly            |
| Analytics                 | Cloudflare Web Analytics                     | Free, cookieless                  |
| Domain                    | `eloyye.com` (already owned)                 | Move DNS to Cloudflare            |
| RSS / sitemap             | Generated at build from MDX frontmatter      |                                   |

**Non-goals:** comments, server-rendered dynamic pages, search-as-a-service, image CDN beyond Cloudflare's defaults.

---

## 2. Repository Layout

```
.
├── app/                          # React Router v7 convention
│   ├── root.tsx                  # HTML shell, <head>, analytics snippet
│   ├── routes.ts                 # Route config (RR7 file-based or explicit)
│   ├── routes/
│   │   ├── _index.tsx            # / (About / landing)
│   │   ├── work.tsx              # /work
│   │   ├── contact.tsx           # /contact
│   │   ├── blog._index.tsx       # /blog (post list)
│   │   └── blog.$slug.tsx        # /blog/:slug (renders MDX)
│   ├── components/
│   │   ├── ui/                   # shadcn-generated primitives
│   │   ├── layout/               # Header, Footer, Container
│   │   ├── mdx/                  # MDX component overrides (h1, code, etc.)
│   │   └── ...
│   ├── content/
│   │   ├── posts/                # *.mdx blog posts
│   │   └── projects/             # *.mdx project entries
│   ├── lib/
│   │   ├── content.ts            # MDX discovery + frontmatter parsing
│   │   ├── rss.ts                # RSS generator
│   │   ├── sitemap.ts
│   │   └── og.ts                 # Open Graph helpers
│   └── styles/
│       └── app.css               # Tailwind entry
├── functions/
│   └── api/
│       └── contact.ts            # Pages Function: contact form handler
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-default.webp
├── scripts/
│   ├── build-rss.ts              # Run post-build
│   └── collect-slugs.ts          # Feeds prerender list
├── docs/
│   └── PLAN.md                   # This file
├── react-router.config.ts
├── vite.config.ts
├── tailwind.config.ts
├── components.json               # shadcn config
├── tsconfig.json
├── wrangler.toml                 # Optional, for local Pages dev
├── package.json
└── bun.lockb
```

**Notes:**

- Use `app/` (RR7 default) rather than `src/`.
- Keep MDX content under `app/content/` so Vite's module graph picks it up; alternatively place at repo root and configure Vite `resolve.alias`.
- `functions/` is the Cloudflare Pages convention — files map to routes automatically.

---

## 3. Build Order (with detail)

Each phase ends in a deployable, working site. Don't move on until the previous phase is green in production.

### Phase 1 — Scaffold & first deploy

**Goal:** empty site live at `eloyye.com` over HTTPS.

1. `bun create` an RR7 app or scaffold manually:
   ```
   bun create react-router@latest personal-site
   ```
   When prompted, choose: TypeScript, no Tailwind (we will add v4 manually for control), no DB.
2. Replace npm/yarn references with Bun:
   - `bun install`
   - Add `"packageManager": "bun@<version>"` to `package.json`
3. Configure `react-router.config.ts` for SSG:
   ```ts
   export default {
     ssr: false, // pure static
     prerender: true, // RR7 will prerender all known routes
   } satisfies Config;
   ```
4. Install Tailwind v4: `bun add -D tailwindcss @tailwindcss/vite`. Add the Vite plugin and an `app.css` with `@import "tailwindcss";`.
5. Init shadcn:

   ```
   bunx shadcn@latest init
   ```

   - Style: New York or Default
   - Base color: Neutral
   - CSS variables: yes
   - Component path: `~/components/ui`
   - Confirm `components.json` paths match RR7's `~/` alias (set in `tsconfig.json` and `vite.config.ts`).

6. Add a placeholder `_index.tsx` with "Hello".
7. Create Cloudflare Pages project:
   - Connect GitHub repo
   - Build command: `bun run build`
   - Output: `build/client` (RR7 SSG default)
   - Node compat: enable `nodejs_compat` flag
   - Bun: set env var `BUN_VERSION=1.x` (Pages supports Bun)
8. Move DNS for `eloyye.com` to Cloudflare nameservers (if not already). Add custom domain in Pages → Custom Domains. Cloudflare auto-issues a cert.
9. Verify HTTPS, redirect `www → apex` (or vice versa) via Pages redirects or a `_redirects` file in `public/`.

**Edge cases to handle now:**

- Apex vs `www` — pick a canonical and 301 the other.
- HTTP → HTTPS — Pages does this automatically; verify in DevTools.
- Trailing slash policy — RR7 prerenders without trailing slashes (canonical form). Add `public/_redirects` with `/*/ /:splat 301` to strip trailing slashes from incoming requests. The redirect is enforced by Cloudflare Pages (not RR7, which has no runtime in SSG mode); the file is committed to the repo and deployed with the site — there is no API/Wrangler command to manage it out-of-band.
- Set HSTS via `_headers` once you're confident in the setup (start short, raise to 1 year later).

### Phase 2 — MDX pipeline + first blog post

**Goal:** `/blog/hello-world` renders an MDX file from the repo, fully prerendered.

1. Install: `bun add @mdx-js/rollup remark-frontmatter remark-mdx-frontmatter remark-gfm rehype-slug rehype-autolink-headings rehype-pretty-code shiki gray-matter`.
2. Configure `vite.config.ts` to add `mdx()` _before_ `reactRouter()`:
   ```ts
   import mdx from "@mdx-js/rollup";
   import remarkFrontmatter from "remark-frontmatter";
   import remarkMdxFrontmatter from "remark-mdx-frontmatter";
   import remarkGfm from "remark-gfm";
   import rehypeSlug from "rehype-slug";
   import rehypeAutolinkHeadings from "rehype-autolink-headings";
   import rehypePrettyCode from "rehype-pretty-code";
   ```
   Plugin order matters: `mdx` must run before `reactRouter`.
3. Create `app/lib/content.ts`:
   - `import.meta.glob('../content/posts/*.mdx', { eager: true })` to discover posts at build time
   - Each module exposes `frontmatter` (via `remark-mdx-frontmatter`) and a default React component
   - Build a typed `Post` array sorted by date
4. Define a `PostFrontmatter` type:
   ```ts
   type PostFrontmatter = {
     title: string;
     slug: string; // canonical, used for URL
     date: string; // ISO 8601
     description: string; // for OG + RSS
     tags?: string[];
     draft?: boolean;
     ogImage?: string;
   };
   ```
5. Add `app/routes/blog.$slug.tsx`:
   - Loader resolves the post by slug; throw 404 `Response` if missing
   - Render the MDX component with shared `MDXProvider` overrides
6. Add `app/routes/blog._index.tsx` listing posts (filter `draft: true` outside `import.meta.env.DEV`).
7. **Prerender the slug list.** RR7's `prerender` option accepts either `true` (auto-discovered routes) or a function/array. For dynamic segments (`$slug`), provide an explicit list:
   ```ts
   prerender: async () => {
     const slugs = await collectSlugs(); // reads MDX frontmatter
     return ["/", "/work", "/contact", "/blog", ...slugs.map((s) => `/blog/${s}`)];
   };
   ```
8. Author one real post `app/content/posts/hello-world.mdx` and verify the build outputs a static HTML file at `build/client/blog/hello-world/index.html`.

**Edge cases:**

- **Drafts:** filter from listings, RSS, sitemap, _and_ the prerender list — but allow access in `import.meta.env.DEV`.
- **Unicode slugs:** normalize with `slugify` (lower-case, strip diacritics). Frontmatter `slug` is the source of truth, not the filename.
- **Duplicate slugs:** fail the build loudly in `collectSlugs()`.
- **Future-dated posts:** decide policy — exclude until publish date, or always show. Recommend exclude.
- **Code block highlighting:** use `rehype-pretty-code` with a single theme (e.g., `github-dark-default`) to keep CSS small. Don't ship Shiki to the client.
- **Images in MDX:** put under `app/content/posts/<slug>/` and import them from MDX so Vite hashes + optimizes. Avoid raw `/public` paths for post-specific media.
- **Heading collisions:** `rehype-slug` deduplicates with `-1`, `-2` suffixes — fine.
- **External links:** add a remark/rehype plugin or MDX `<a>` override to set `target="_blank" rel="noopener noreferrer"` for non-relative hrefs.
- **Reading time:** compute in the loader from the raw MDX source; cache via the module graph.

### Phase 2.1 — Blog topics + nested article URLs

**Goal:** every blog post belongs to one canonical topic, and article URLs become `/blog/$topic/$article` (for example `/blog/software/hello-world`, `/blog/sports/nba-notes`, `/blog/rant/static-site-friction`).

1. Define a fixed topic registry and type. Topics are not arbitrary strings:

   ```ts
   const topics = {
     software: { label: "Software", description: "Engineering notes and systems work." },
     sports: { label: "Sports", description: "Sports writing and observations." },
     rant: { label: "Rant", description: "Looser notes and opinionated posts." },
   } as const;

   type TopicSlug = keyof typeof topics;
   ```

2. Extend post frontmatter with a required canonical `topic` from that fixed subset:
   ```ts
   type PostFrontmatter = {
     title: string;
     topic: TopicSlug; // one of: "software", "sports", "rant"
     slug: string; // canonical article slug within the topic
     date: string;
     description: string;
     tags?: string[];
     draft?: boolean;
     ogImage?: string;
   };
   ```
3. Treat `topic` and `slug` as the URL source of truth:
   - Article route: `/blog/:topic/:article`
   - Topic index route: `/blog/:topic`
   - Blog index route: `/blog`, grouped by topic or with topic filters
   - Full canonical path helper: `getPostPath(post) => /blog/${post.topic}/${post.slug}`
4. Rename the dynamic article route from `app/routes/blog.$slug.tsx` to a nested topic/article route such as `app/routes/blog.$topic.$article.tsx` (or the equivalent explicit route config entry).
5. Add a topic index route such as `app/routes/blog.$topic.tsx`:
   - Loader resolves all published posts for `params.topic`
   - Throw 404 if the topic has no published posts outside dev
   - Render posts with the same shadcn primitives used by `/blog`
6. Update `app/lib/content.ts`:
   - Export `topics`, `TopicSlug`, `getTopic(topic)`, and `isTopicSlug(value)` from one place.
   - Validate `topic` with the same slug normalization policy as article slugs.
   - Reject any post whose `topic` is not a key in the fixed `topics` registry.
   - Detect duplicate `(topic, slug)` pairs and fail the build loudly.
   - Allow the same article slug in different topics only if the pair is unique.
7. Update the prerender collector:

   ```ts
   prerender: async () => {
     const posts = await collectPosts();
     const topics = [...new Set(posts.map((post) => post.topic))];

     return [
       "/",
       "/work",
       "/contact",
       "/blog",
       ...topics.map((topic) => `/blog/${topic}`),
       ...posts.map((post) => `/blog/${post.topic}/${post.slug}`),
     ];
   };
   ```

8. Migrate existing posts:
   - Move `hello-world` from `/blog/hello-world` to `/blog/software/hello-world` unless another topic is more accurate.
   - Add a redirect from the old URL to the new canonical URL:
     ```
     /blog/hello-world /blog/software/hello-world 301
     ```
   - For future migrations, keep one redirect per moved public article.
9. Update all blog links:
   - Blog list cards link to `/blog/${topic}/${slug}`
   - Topic badges link to `/blog/${topic}`
   - Metadata, Open Graph URLs, RSS item links, sitemap URLs, and canonical links use the nested path.
10. Update RSS/sitemap rules when those phases are implemented:

- Global RSS remains `/rss.xml`
- Optional topic feeds can be `/blog/software/rss.xml`, `/blog/sports/rss.xml`, etc.
- Sitemap includes `/blog`, topic indexes, and article URLs.

**Edge cases:**

- **Topic slug normalization:** use lower-case ASCII slugs, strip diacritics, and reject invalid frontmatter rather than silently changing public URLs.
- **Topic renames:** a topic rename changes every URL under it. Require redirects for every published post in the old topic path.
- **Drafts and future posts:** topic indexes and prerender lists must exclude draft/future posts outside dev. If all posts in a topic are hidden, the topic page should not prerender in production.
- **Duplicate article slugs:** duplicates are allowed across different topics only if canonical URLs remain unique; duplicates inside one topic fail the build.
- **Unknown topics:** fail the build. Do not generate implicit topics from frontmatter.
- **Backward compatibility:** keep `/blog/:slug` only as redirects, not as a second render path, to avoid duplicate content and canonical URL ambiguity.
- **Topic taxonomy drift:** prefer a small controlled set at first (`software`, `sports`, `rant`) and split topics later only when there are enough posts to justify it.

### Phase 3 — About, Work, layout, design system

**Goal:** real content pages, consistent header/footer, dark mode.

1. Build `app/components/layout/{Header,Footer,Container}.tsx`.
2. Add shadcn primitives as needed: `button`, `card`, `separator`, `badge`, `input`, `textarea`, `label`, `sonner` (for toasts).
3. Theme:
   - Use `next-themes`-equivalent for RR7 (e.g., a small client island reading `localStorage` + `prefers-color-scheme`)
   - Avoid FOUC: inline a `<script>` in `root.tsx` `<head>` that sets the `class` on `<html>` _before_ React hydrates
4. Typography: `@tailwindcss/typography` for `prose` styling on blog posts. Customize the `prose` colors for dark mode.
5. `/` (About): hand-written JSX — short bio, links, recent posts (top 3).
6. `/work`: render from `app/content/projects/*.mdx`. Each project has frontmatter `{ title, summary, url, repo, tech[], year, featured }`. Render as cards.
7. Accessibility checks: skip-to-content link, focus rings, semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`), `aria-current="page"` on active nav.

**Edge cases:**

- **Theme flash (FOUC):** the inline pre-hydration script is mandatory for static sites — without it dark mode flickers on every navigation.
- **Long titles wrapping in cards:** clamp with `line-clamp-N` utility.
- **No-JS fallback:** RR7 SSG ships JS for hydration but content is in HTML. Test with JS disabled — links should work, theme defaults to system.

### Phase 4 — Contact form + Cloudflare Email Service + Turnstile

**Goal:** working contact form that emails you.

1. Build `/contact` page: `Input` (name, email), `Textarea` (message), Turnstile widget, submit button. Use `react-hook-form` + `zod` for validation, or roll a tiny manual implementation (form is small).
2. Add Turnstile site key to `.env` and a server secret to Cloudflare Pages env vars (Production + Preview). Render the widget client-side; submit returns a token.
3. Implement `functions/api/contact.ts` (Pages Function):
   - Accept POST JSON
   - Validate with `zod` (length caps: name ≤ 100, email RFC, message ≤ 5000)
   - Verify Turnstile token via `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET` and the requester's IP (`request.headers.get("CF-Connecting-IP")`)
   - Honeypot field: include a hidden `website` input; reject if non-empty
   - Rate limit by IP using Cloudflare KV or the Workers Rate Limiting API (e.g., 5/hour/IP)
   - Send via Cloudflare Email Service:
     ```ts
     await env.EMAIL.send({
       to: "you@eloyye.com",
       from: "noreply@eloyye.com",
       replyTo: userEmail,
       subject: "Contact form: <name>",
       text: message,
     });
     ```
   - Return 200 JSON; client shows toast.
4. **Email Service setup on `eloyye.com`** — required for sending and inbox deliverability:
   - Enable Cloudflare Email Service for the domain.
   - Configure the Worker `send_email` binding.
   - Restrict allowed sender addresses to `noreply@eloyye.com`.
   - **DMARC (TXT `_dmarc`):** start with `v=DMARC1; p=none; rua=mailto:you@eloyye.com` for monitoring, tighten later.
5. Test from Preview deploys before merging to Production.

**Edge cases:**

- **Email Service sender verification:** `from` must be accepted by the Cloudflare Email Service binding and domain setup.
- **Turnstile token replay:** tokens are single-use; backend must verify each one and never trust the client.
- **CORS:** Pages Function and form are same-origin → no CORS needed. If you ever split them, lock `Access-Control-Allow-Origin` to your domain only.
- **Email injection:** never interpolate user input into headers (`Subject`, `From`, etc.) without stripping CR/LF.
- **Bounces:** `noreply@` won't accept replies. Use `replyTo` set to the user so you can reply directly from your inbox.
- **Disposable email domains:** optional — block known disposable domains via a small list if spam becomes an issue.
- **Form double-submit:** disable button while in-flight; debounce.
- **JS disabled:** form won't work without JS (Turnstile + fetch). Acceptable for a personal site; mention an email fallback in the page copy.
- **Secrets handling:** `TURNSTILE_SECRET` goes in Worker env vars (encrypted), never in the repo. `.dev.vars` for local dev, gitignored.

### Phase 5 — RSS, sitemap, robots, Open Graph, analytics, polish

**Goal:** discoverable, shareable, observable.

1. **RSS** (`/rss.xml`):
   - Build-time script (`scripts/build-rss.ts`) reads posts, emits Atom or RSS 2.0 to `build/client/rss.xml`
   - Hook into `package.json` `build` script: `bun run build && bun scripts/build-rss.ts`
   - Add `<link rel="alternate" type="application/rss+xml">` in `root.tsx` `<head>`
2. **Sitemap** (`/sitemap.xml`): same pattern, list all canonical URLs.
3. **`robots.txt`**: allow all, point to sitemap.
4. **Open Graph:**
   - Default `og:image` at `public/og-default.webp` (1200×630)
   - Per-post: either author a static image alongside the MDX, or generate at build with `satori` + `@resvg/resvg-js` (free, no runtime cost)
   - Set `og:title`, `og:description`, `og:url`, `og:type`, Twitter card meta in each route's `meta` export
5. **Cloudflare Web Analytics:**
   - Pages → Analytics → Enable Web Analytics for the project
   - It auto-injects the beacon for the project's domain — no script tag needed
   - Verify in dashboard after a deploy
6. **Performance pass:**
   - Lighthouse on a real Pages preview (not local)
   - Goal: 100/100/100 on a content page (Performance/Accessibility/Best Practices/SEO)
   - Compress images (use `vite-imagetools` or pre-compress)
   - Subset/self-host fonts (avoid Google Fonts external request); use `font-display: swap` and preload the primary font
7. **Headers** (`public/_headers`):
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (only after verifying HTTPS works everywhere)
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `Content-Security-Policy` — start in report-only, then enforce. Allowlist: `'self'`, `https://challenges.cloudflare.com` (Turnstile), `https://static.cloudflareinsights.com` (analytics).
   - Long cache for hashed assets (`/assets/*`): `Cache-Control: public, max-age=31536000, immutable`
   - Short cache for HTML: `Cache-Control: public, max-age=0, must-revalidate`
8. **404 page:** `app/routes/$.tsx` catch-all with a friendly message and link home. Ensure it's prerendered to `404.html` (Pages serves this for unmatched routes).

**Edge cases:**

- **CSP + Turnstile + Web Analytics:** both inject `<script>` from Cloudflare domains. Test the policy before enforcing.
- **OG images and crawler caching:** Twitter/Facebook cache aggressively. Append a `?v=2` query when you change them, or use the platform debugger to refresh.
- **RSS breaking changes:** never reuse a slug — feed readers de-dupe by `<guid>`. Use the canonical post URL as the GUID.
- **Self-hosted fonts licensing:** confirm the license permits self-hosting (Google Fonts entries usually do; Adobe Fonts don't).

---

## 4. Cross-cutting Concerns

### TypeScript hygiene

- `"strict": true`, `"noUncheckedIndexedAccess": true`, `"verbatimModuleSyntax": true`
- Path alias `~/*` → `./app/*`
- Type MDX modules via a `mdx.d.ts` declaration

### Content authoring workflow

1. Create `app/content/posts/<slug>.mdx` with frontmatter
2. `bun dev` to preview locally
3. Commit + push → Pages builds a Preview deploy on the branch
4. Merge to `main` → Production deploy
5. Editing in IDE only — no CMS UI by design

### Local dev

- `bun dev` for the app
- `bunx wrangler pages dev build/client --compatibility-flag=nodejs_compat` to test Pages Functions locally with `.dev.vars`
- For pure UI work, the Functions emulator isn't needed

### CI

- Optional GitHub Action: typecheck + build on PR. Pages already builds on push, but a pre-merge typecheck is cheap insurance.
- `bun run typecheck` (= `tsc --noEmit`), `bun run build`, `bun run lint` (Biome or ESLint — pick one)

### Error handling & observability

- RR7 `ErrorBoundary` on root + per-route. Never leak stack traces in production.
- Pages Functions: log via `console.error`; visible in Cloudflare dashboard → Functions → Real-time logs. Avoid logging PII (email addresses, message bodies).
- Add a tiny client-side error reporter (optional): post to a Pages Function that logs to Logpush or just to console. Skip Sentry for cost.

### Backups & redundancy

- Everything is in git → GitHub is the backup
- Posts are plain MDX → portable to any static generator if you migrate
- DNS is at Cloudflare → export zone file periodically

### Costs (expected $/month)

- Cloudflare Pages: $0 (well within free tier)
- Workers/Functions: $0 (100k requests/day free)
- Cloudflare Email Service: $0
- Turnstile: $0
- Web Analytics: $0
- Domain renewal: ~$10/year (already owned)
- **Total: ~$10/year**

---

## 5. Edge Cases Catalogue (master list)

A consolidated reference — most are covered above in context, but worth scanning before each phase ships.

### Content

- Duplicate slugs across posts/projects → fail build
- Unicode in slugs → normalize via `slugify`
- Drafts leaking into prod → exclude from list, RSS, sitemap, prerender
- Future-dated posts → exclude until publish date
- Renamed slugs → add `_redirects` rule to preserve old URLs
- Empty posts directory at first build → don't crash; return empty list
- MDX import at runtime → confirm tree-shaking; only the active post should be in its chunk

### Routing & SSG

- Trailing-slash inconsistency → pick one, redirect the other
- 404 for missing slug → throw `Response(null, { status: 404 })` from loader
- Catch-all route prerendered as `404.html` and served by Pages
- Hash-based fragment links (`#section`) → ensure `rehype-slug` runs before consumers

### Forms & email

- Header injection via CR/LF → strip
- Replay of Turnstile token → backend single-use validation
- Rate limit bypass via rotating IPs → accept; add per-session limit if needed
- DMARC at `p=none` initially; tighten only after confirming legit mail passes

### Security

- CSP allowlist must include Cloudflare Turnstile + Insights domains
- Pages env vars must not leak to client — only `VITE_*` prefixed vars are exposed
- Don't commit `.dev.vars` (gitignore it)

### Performance

- LCP image: preload + `fetchpriority="high"`
- Avoid layout shift: set `width`/`height` on all `<img>`
- Bundle bloat from MDX: each post compiles to its own component; split with route chunks (RR7 default)

### SEO

- Canonical URL meta on every page
- One `<h1>` per page
- Descriptive `<title>` and `meta description` per route
- Submit sitemap to Google Search Console + Bing Webmaster Tools

### Domain / DNS

- Cloudflare Email Service domain verification and DMARC before going live with the contact form
- Apex vs `www` canonical
- Cloudflare proxy ON for the apex (orange cloud) — enables analytics, HTTPS, caching

---

## 6. Deferred / Not Now

Documenting explicitly to prevent scope creep:

- Comments (Giscus, Disqus, etc.)
- Newsletter (Buttondown, Resend Audiences)
- Search (Pagefind would be the cheap pick if added later — fully static)
- i18n
- Tag/category pages (add when post count > 20)
- View counts (would need D1 or KV)
- CMS UI (Tina/Decap) — only if MDX-in-IDE becomes painful
- Image CDN beyond Cloudflare default (Cloudflare Images is paid)
- A/B testing, feature flags
- Sentry / external error tracking

---

## 7. Definition of Done (per phase)

| Phase | Done means                                                                                                  |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| 1     | `https://eloyye.com` returns 200, valid cert, deploys on push                                               |
| 2     | One MDX post live, prerendered, syntax highlighted, listed at `/blog`                                       |
| 3     | About + Work + layout + dark mode shipped, Lighthouse ≥ 95 across the board                                 |
| 4     | Contact form sends to your inbox, Turnstile blocks bots, and DMARC/domain verification is configured        |
| 5     | RSS validates, sitemap submitted, analytics receiving events, security headers green on securityheaders.com |

---

## 8. Open Decisions (revisit when relevant)

- Linter: Biome (fast, single tool) vs ESLint + Prettier
- OG image generation: hand-authored vs satori-generated
- Theme: light-default, dark-default, or system-default
- Font: system stack vs self-hosted (Inter, Geist, etc.)
- Project entries: MDX vs typed TS array (currently MDX for consistency — revisit if it feels heavy)
