---
title: 'I shipped a 108-entry agent registry and put it on two hosts. Five traps cost me the afternoon.'
published: false
tags: nextjs, hacktoberfest, opensource, webdev
---

I wanted a repo that made people say "wow" without being a hero section and a gradient. What came out is a working product: a registry of **108 real tools from the open agent ecosystem** (24 skills, 18 MCP servers, 18 APIs, 9 protocols, 12 harnesses, 27 free tools), each with its actual install command, a benchmark scoreboard, and a Hacktoberfest wave of five scoped good-first issues.

Then I deployed it to GitHub Pages **and** Vercel, and hit five traps in a row. Every one of them looked like a different disease and had the same symptom: something was broken and nothing said so.

- Repo: https://github.com/aniruddhaadak80/wow-repo
- Live on Pages: https://aniruddhaadak80.github.io/wow-repo/

## Trap 1: `export const dynamic` cannot be computed

The Pages build failed on four API routes at once:

```ts
export const dynamic = IS_PAGES_EXPORT ? 'force-static' : 'force-dynamic'
// Error: Next.js can't recognize the exported `dynamic` field...
```

Segment config is read by static analysis, so a ternary is invisible to it. The fix is a runtime branch, not a config branch:

```ts
export const revalidate = 3600 // literal, so both builds can read it

export async function GET(request: Request) {
  if (IS_PAGES_EXPORT) {
    // No server: serve the whole catalog and say so.
    return NextResponse.json({ total: all.length, skills: all })
  }
  const { searchParams } = new URL(request.url)
  ...
}
```

## Trap 2: metadata routes need a literal `revalidate` to export

`robots.ts`, `sitemap.ts`, `manifest.ts`, and `opengraph-image.tsx` failed with `revalidate not configured on route "/sitemap.xml" with "output: export"`. I removed `revalidate` because it looked meaningless on a static file. That was backwards: the static export _requires_ a literal segment config on those routes. Restore it and the export completes.

The lesson I keep relearning: "this config is pointless here" is a hypothesis, not a finding. Delete it, run the build, read the error.

## Trap 3: `force-static` silently broke the query API

This was the nasty one. Nothing errored. The API just stopped filtering:

```
/api/skills               total=108
/api/skills?craft=Design  total=108   <- should be 8
/api/skills?kind=mcp      total=18    <- worked, which made it weirder
```

`dynamic = 'force-static'` caches the response per route and ignores the query string. A filter that quietly returns everything is worse than a 500. So the API stays `force-dynamic` on Vercel, and the Pages export serves a static snapshot of the whole catalog instead, with the limitation written in the code:

```ts
// GitHub Pages has no server to read a query string from, so the exported
// route serves the full registry. The filterable API is a Vercel-only
// convenience; every page on the site is prerendered either way.
```

Also: the README documented `?craft=` while the handler read `?category`. Now it reads `craft` and falls back to `category`, so old links keep working.

## Trap 4: the "broken deploy" was just a login page

After a successful production deploy, every route returned a 332KB HTML page. `/sitemap.xml` came back as `text/html`. The site worked fine locally. It turned out to be **Vercel Deployment Protection**: anonymous visitors get a login screen, and it is a plausible-looking HTML page.

```bash
curl -s https://your-project.vercel.app | grep -o '<title>.*</title>'
# <title>Login - Vercel</title>   <- not your site
```

There is no CLI flag for it (`vercel curl` only talks to deployments, not the Vercel API), so it is Settings → Deployment Protection → Off. GitHub Pages was already public, which is how I found out the code was fine all along.

## Trap 5: two agents, one repo

A second agent session was writing to the same directory the whole time. It deleted three component files while my branch imported them, and committed a `HACKTOBERFEST.md` reduced to zero bytes. I restored what I could; `count-up.tsx` is a reconstruction from its usage contract because the original was overwritten in `.next`.

What actually saved the work was one test. `content/issues.ts` holds the five good-first issues as data with the files each one touches, and `content/issues.test.ts` asserts a path either exists or is marked as one the contributor creates:

```ts
it('only references files that exist, or marks the ones to create', () => {
  for (const issue of GOOD_FIRST_ISSUES) {
    for (const file of issue.files) {
      const resolved = path.resolve(process.cwd(), file.path)
      expect(existsSync(resolved), `${file.path} should exist`).toBe(file.creates === undefined)
    }
  }
})
```

It caught a file being deleted under me, twice. That is the kind of test worth writing in any repo where the docs and the tree can drift: assert the thing you would notice too late.

## What actually shipped

The page is a registry, not a mock: `/skills` filters over the real 108 entries, `/discoveries` is a sourced log, the hero search runs against the same data, and the Contribute section renders the issue list from `content/issues.ts` so the site and the issue tracker cannot disagree.

For Hacktoberfest the five issues are scoped to files with acceptance criteria already written, no "add your name to a list" tasks: copy an install command from a card, keyboard-navigate the explorer, cover the registry query layer with tests, cover the findings query layer with tests, and document the reduced-motion contract.

## The threads this came from

- [Deploying a Next.js 14 application to Github Pages using static export](https://dev.to/donis3/deploying-a-nextjs-14-application-to-github-pages-using-static-export-36hm) — the `basePath` and `configure-pages` gotchas
- [Next.js Deploy as a Static Site using Github Pages](https://dev.to/lico/nextjs-deploy-as-static-site-using-github-pages-3bhm) — `output: 'export'` with an env-driven base path and `.nojekyll`
- [Hacktoberfest 2023: Contributing to React & Next.js projects](https://dev.to/this_mkhy/hacktoberfest-2023-contributing-to-react-nextjs-projects-2laf) — the shape of a repo built for first contributions

## If you want to try it

```bash
git clone https://github.com/aniruddhaadak80/wow-repo.git
cd wow-repo
bun install
bun run check   # typecheck + lint + format + 87 tests + production build
```

Full deploy notes, including the exact commands and the manual dashboard step, are in [`docs/DEPLOY.md`](https://github.com/aniruddhaadak80/wow-repo/blob/main/docs/DEPLOY.md).

---

_Disclosure: AI-assisted draft, edited and verified by me. Every command and every error message in this post came from the session that shipped it._
