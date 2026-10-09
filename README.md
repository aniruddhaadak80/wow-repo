# wow-repo

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faniruddhaadak80%2Fwow-repo&project-name=wow-repo&repository-name=wow-repo)

A production-ready Next.js showcase of the open agent stack: skills, MCP servers, public APIs, protocols, harnesses, and free software, in one searchable registry. Built to make people say **wow**.

Skills that ship. Sites that wow.

## Why this exists

Most "wow" repos are a hero, three cards, and a gradient. This one is a working product: a searchable registry of the open agent ecosystem, interactive demos that run on the real catalog, and a build configured for Vercel from day one.

## Features

**Design system**

- Tailwind CSS v4 with CSS-variable tokens and a locked single-accent palette (lime on zinc, light + dark modes)
- Geist + Geist Mono via `next/font` (self-hosted, zero layout shift)
- Shape consistency lock: pills for interactive, 16px tiles, 8px chips
- Documented z-index scale in `lib/constants.ts`, one accent hue, one easing curve
- Reduced-motion support everywhere, including scroll-driven motion
- `content/preflight.ts` renders the rules ledger on the home page and points at the file that enforces each one

**Registry showcase** (`content/registry.ts`, 108 entries across six kinds)

- Skills, MCP servers, APIs, protocols, harnesses, and software, each with a real command and a real link
- `/skills` index with search, kind tabs, and craft filters over all 108 entries
- `/skills/[slug]` detail pages with triggers, a copyable command, the source link, and related entries
- `/agents`: a demo org of 24 agents across eight departments, with a replayable orchestration run
- `/discoveries`: a sourced log of scientific findings, plus published curves on machine-research speed
- Global Cmd/Ctrl+K command palette

**Working demos, not screenshots**

- Live catalog search in the hero (filters the real data, navigates for real)
- A phone mini-app: search, open, and "install" a skill inside a device frame
- The swarm runner: a lead agent fans a task out to real registry entries and merges the reports
- The benchmark scoreboard: sortable runs over typed benchmark content

**Vercel optimization**

- Static generation with ISR (`revalidate = 3600`) on catalog pages
- `generateStaticParams` for every registry route (129 static pages)
- Edge-cached JSON API (`/api/skills?kind=&craft=&q=`) with `stale-while-revalidate`
- AVIF/WebP images, `optimizePackageImports`, security headers
- `next/og` generated social cards, `sitemap.xml`, `robots.txt`, JSON-LD, web manifest
- Vercel Analytics and Speed Insights mounted in the root layout
- Optional bundle analysis: `bun run analyze`

**Developer experience**

- TypeScript strict mode, ESLint (Next core-web-vitals), Prettier with the Tailwind plugin
- Vitest + Testing Library, including dataset integrity tests (unique slugs, valid kinds, real URLs)
- `bun run check` runs typecheck, lint, format check, tests, and build
- GitHub Actions CI on every push and PR
- Loading, error, and 404 boundaries with skeletons

## Quickstart

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # production build
bun start          # serve the production build
bun run check      # typecheck + lint + format + test + build
bun run analyze    # bundle analysis
```

## Deploy

Two targets, one codebase. Both build from `main` with no extra configuration.

| Target             | URL                                         | What runs there                                                             |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------------- |
| Vercel (canonical) | https://wow-repo.vercel.app                 | Full app: ISR, the JSON APIs, image optimization, Analytics, Speed Insights |
| GitHub Pages       | https://aniruddhaadak80.github.io/wow-repo/ | Static export of the same site (`.github/workflows/pages.yml`)              |

```bash
# Vercel, from a clean checkout
npx vercel --prod

# GitHub Pages is already wired: push to main and .github/workflows/pages.yml
# builds with GH_PAGES=true and deploys the out/ directory.
```

The same `next.config.ts` serves both. When `GH_PAGES=true` it emits a fully
static export with the repo-name basePath and no image optimizer, because Pages
has no server. Vercel builds leave the variable unset and keep ISR plus the
`/api/*` routes.

The JSON APIs are Vercel-only. Pages has no server to read a query string, so
the exported API routes exist to satisfy the build and are not served. On
Vercel they return real data: `/api/skills?q=design` filters the registry and
`/api/health` reports a live timestamp.

Live badges:

[![CI](https://github.com/aniruddhaadak80/wow-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/aniruddhaadak80/wow-repo/actions/workflows/ci.yml)
[![Pages](https://github.com/aniruddhaadak80/wow-repo/actions/workflows/pages.yml/badge.svg)](https://github.com/aniruddhaadak80/wow-repo/actions/workflows/pages.yml)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faniruddhaadak80%2Fwow-repo&project-name=wow-repo&repository-name=wow-repo)

## Stack

| Layer     | Choice                          |
| --------- | ------------------------------- |
| Framework | Next.js 16 (App Router, RSC)    |
| UI        | React 19, Tailwind CSS 4        |
| Motion    | Motion (`motion/react`)         |
| Icons     | Phosphor Icons                  |
| Fonts     | Geist, Geist Mono (`next/font`) |
| Tests     | Vitest, Testing Library         |
| Deploy    | Vercel                          |

## Project structure

```
app/                    # App Router: pages, API routes, metadata, og image
components/             # Section components and interactive islands
components/sections/    # One file per page section
content/                # Typed content modules: registry, findings, benchmarks, preflight rules
content/issues.ts       # The good-first-issue list the Contribute section renders
lib/                    # Queries, constants, helpers
docs/                   # Contributor docs: good first issues, design system
.github/                # CI, issue forms, PR template, Dependabot
HACKTOBERFEST.md        # Contributing in October: the first wave and the rules
CONTRIBUTING.md         # The bar for a merge
```

## Hacktoberfest

Five good first issues are written, scoped, and ready to file: the files, the
checks, and the acceptance criteria are already filled in. No "add your name to
a list" tasks, no README typo fixes.

| #   | Issue                                       | Effort  |
| --- | ------------------------------------------- | ------- |
| 1   | Copy an install command from a catalog card | ~30 min |
| 2   | Keyboard-navigate the skills explorer       | ~45 min |
| 3   | Cover the registry query layer with tests   | ~40 min |
| 4   | Cover the findings query layer with tests   | ~40 min |
| 5   | Document the reduced-motion contract        | ~30 min |

Full bodies and checklists live in [docs/good-first-issues.md](./docs/good-first-issues.md),
and the rules of engagement in [HACKTOBERFEST.md](./HACKTOBERFEST.md). The same
list renders on the home page from `content/issues.ts`, and a test asserts every
path those issues name still exists, so a stale issue fails the suite.

## Design notes

- **One accent, locked.** `#4d7c0f` in light mode, `#bef264` in dark. No second accent, no purple gradients.
- **One source of truth.** Every page reads from `content/registry.ts`; the demo org, benchmarks, and findings have their own typed modules.
- **Eyebrow budget.** At most one small-caps label per three sections.
- **One marquee.** The stack wall under the hero is the only infinite scroll on the site.
- **Motion is motivated.** Every animation communicates something: the phone navigates, the swarm reports, the numbers count up once.
- **Honest numbers.** Counts are computed at build time; sample data says so on the surface that renders it.

## License

MIT. Registry entries point at real projects; the install commands are samples for the demo.
