# eloyye.com

Personal site for `eloyye.com`, built as a static React Router v7 application with an MDX-powered blog. The project is planned around low operational cost on Cloudflare Pages and keeps content, UI, and deployment configuration owned in this repository.

See [docs/PLAN.md](docs/PLAN.md) for the full implementation plan and phase-by-phase roadmap.

## Overview

- **Framework:** React Router v7 in SSG/prerender mode
- **Runtime and package manager:** Bun
- **Build tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Tailwind Typography, and local UI primitives
- **Content:** MDX blog posts and project entries in `app/content`
- **Syntax highlighting:** `rehype-pretty-code` with Shiki at build time
- **Hosting target:** Cloudflare Pages at `eloyye.com`

Current routes:

- `/` — About page with recent writing
- `/work` — selected projects from MDX frontmatter
- `/blog` — published blog post index
- `/blog/:topic` — topic index for canonical blog topics
- `/blog/:topic/:article` — prerendered MDX blog posts

Planned routes and features include `/contact`, RSS, sitemap generation, Turnstile-protected contact form handling, and Cloudflare Web Analytics.

## Project Structure

```text
app/
  components/
    layout/           Shared Header, Footer, and Container
    mdx/              Shared MDX component overrides
    ui/               Local UI primitives
  content/
    posts/            Blog posts as .mdx files
    projects/         Project entries as .mdx files
  lib/
    content.ts        Post/project discovery, validation, reading time
  routes/             React Router route modules
  app.css             Tailwind entry
  root.tsx            Document shell and theme bootstrap
  routes.ts           Route config
docs/
  PLAN.md             Implementation roadmap
public/
  _redirects          Cloudflare Pages redirects
  robots.txt          Basic crawler policy
scripts/
  collect-slugs.ts    Build-time blog path collection for prerendering
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

### Blog Posts

Blog posts live in `app/content/posts/*.mdx`. Each post must define frontmatter with these required fields:

```yaml
---
title: "Post title"
topic: "software"
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

The canonical URL is `/blog/:topic/:slug`. Supported topics are defined in `app/lib/content.ts` and are currently:

- `software`
- `sports`
- `rant`

Topic and post slugs are the canonical URL source, must already be normalized, and duplicate `(topic, slug)` pairs fail the build. Drafts and future-dated posts are excluded from production listings and prerendered output.

### Projects

Project entries live in `app/content/projects/*.mdx`. The `/work` page renders project cards from frontmatter:

```yaml
---
title: "Project title"
summary: "Short description for the work page."
url: "https://example.com"
repo: "https://github.com/example/project"
tech:
  - React Router
  - MDX
year: 2026
featured: true
---
```

Projects are sorted with featured entries first, then by year descending.

## Build and Deployment

Create a static production build:

```bash
bun run build
```

React Router prerenders the known static routes plus the blog topic/article paths returned by `scripts/collect-slugs.ts`. The Cloudflare Pages build should use:

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
- Keep project content in `app/content/projects`.
- Prefer build-time/static behavior over runtime services.
- Keep MDX frontmatter valid and fail builds loudly for duplicate or malformed canonical paths.
- Do not commit secrets. Cloudflare values such as Turnstile secrets belong in Worker environment variables.
