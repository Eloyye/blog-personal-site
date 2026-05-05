# eloyye.com

Personal site for `eloyye.com`, built as a static React Router v7 application with an MDX-powered blog. The project is planned around low operational cost on Cloudflare Pages and keeps content, UI, and deployment configuration owned in this repository.

See [docs/PLAN.md](docs/PLAN.md) for the full implementation plan and phase-by-phase roadmap.

## Overview

- **Framework:** React Router v7 in SSG/prerender mode
- **Runtime and package manager:** Bun
- **Build tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with local UI primitives
- **Content:** MDX blog posts in `app/content/posts`
- **Syntax highlighting:** `rehype-pretty-code` with Shiki at build time
- **Hosting target:** Cloudflare Pages at `eloyye.com`

Current routes:

- `/` — home page
- `/blog` — published blog post index
- `/blog/:slug` — prerendered MDX blog posts

Planned routes and features include `/work`, `/contact`, project MDX entries, RSS, sitemap generation, Turnstile-protected contact form handling, and Cloudflare Web Analytics.

## Project Structure

```text
app/
  components/
    mdx/              Shared MDX component overrides
    ui/               Local UI primitives
  content/
    posts/            Blog posts as .mdx files
  lib/
    content.ts        Post discovery, frontmatter validation, reading time
  routes/             React Router route modules
  app.css             Tailwind entry
  root.tsx            Document shell
  routes.ts           Route config
docs/
  PLAN.md             Implementation roadmap
public/
  _redirects          Cloudflare Pages redirects
scripts/
  collect-slugs.ts    Build-time blog slug collection for prerendering
```

## Setup

Use Bun for every project command.

```bash
bun install
```

Start the local development server:

```bash
bun run dev
```

The site runs locally at `http://localhost:5173`.

## Common Commands

```bash
bun run dev           # Start the React Router dev server
bun run build         # Create a production build
bun run typecheck     # Generate route types and run TypeScript
bun run lint          # Run oxlint
bun run format        # Check formatting with oxfmt
bun run test          # Run Vitest
bun run check         # Typecheck, lint, format check, and test
bun run check:fix     # Apply lint and format fixes
```

## Content

Blog posts live in `app/content/posts/*.mdx`. Each post must define frontmatter with these required fields:

```yaml
---
title: "Post title"
slug: "post-title"
date: "2026-01-01"
description: "Short summary for listings, RSS, and metadata."
---
```

Optional fields:

```yaml
tags:
  - react
draft: true
ogImage: "/path-or-imported-image.png"
```

Post slugs are the canonical URL source, must already be normalized, and must be unique. Drafts and future-dated posts are excluded from production listings and prerendered output.

## Build and Deployment

Create a static production build:

```bash
bun run build
```

React Router prerenders the known routes plus the blog slugs returned by `scripts/collect-slugs.ts`. The Cloudflare Pages build should use:

- **Build command:** `bun run build`
- **Output directory:** `build/client`
- **Runtime:** Bun

`public/_redirects` is deployed with the static output and handles Cloudflare Pages redirects.

## Contribution

Before opening a change, run:

```bash
bun run check
```

Keep changes aligned with [docs/PLAN.md](docs/PLAN.md):

- Use `app/` for React Router code.
- Keep blog content in `app/content/posts`.
- Prefer build-time/static behavior over runtime services.
- Keep MDX frontmatter valid and fail builds loudly for duplicate or malformed slugs.
- Do not commit secrets. Cloudflare values such as Turnstile secrets and MailChannels DKIM keys belong in Pages environment variables.
