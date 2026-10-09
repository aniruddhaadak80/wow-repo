# Deploying wow-repo

Three targets, one repo. Everything here is what was actually run to get this
live, in order.

| Target                       | URL                                                                                                                     | Status                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| GitHub repository            | https://github.com/aniruddhaadak80/wow-repo                                                                             | public, `main`          |
| GitHub Pages (static export) | https://aniruddhaadak80.github.io/wow-repo/                                                                             | **public, live**        |
| Vercel (server build)        | https://wow-repo-aniruddha-adaks-projects.vercel.app                                                                    | deployed, protection on |
| Vercel deploy button         | [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faniruddhaadak80%2Fwow-repo) | one click               |

## 1. GitHub repository

```bash
cd wow-repo
gh repo create aniruddhaadak80/wow-repo --public --source=. --push
```

The remote is already set to `origin`, so a plain push is enough for later work:

```bash
git push origin main
```

## 2. GitHub Pages (static export)

The repo exports a second, fully static build for Pages. Both targets read the
same source and are told apart by one env var:

```bash
# lib/pages-export.ts
export const IS_PAGES_EXPORT = process.env.GH_PAGES === 'true'
```

`next.config.ts` uses it for `output: 'export'`, `basePath: '/wow-repo'`,
`images.unoptimized`, and to drop the security headers (Pages serves its own).
Metadata routes keep a literal `revalidate` because the export refuses a route
with no segment config, and the JSON APIs take a runtime branch that serves the
whole dataset: a static site has no server to read a query string from.

`.github/workflows/pages.yml` does the rest:

```bash
rm -rf app/api          # route handlers cannot be statically exported
bun run build           # with GH_PAGES=true
touch out/.nojekyll     # Jekyll would drop the _next/ folder
```

Pages is enabled with the workflow as its source:

```bash
gh api -X POST repos/aniruddhaadak80/wow-repo/pages -f build_type=workflow
gh workflow run pages.yml
```

Verified live:

```bash
curl -s https://aniruddhaadak80.github.io/wow-repo/ | grep -o 'Hacktoberfest 2026'
```

## 3. Vercel

```bash
vercel link --yes
vercel env add NEXT_PUBLIC_SITE_URL production --visibility config --no-sensitive
vercel env add NEXT_PUBLIC_REPO_URL production --visibility config --no-sensitive
vercel deploy --prod --yes
```

`NEXT_PUBLIC_*` variables must be added with `--visibility config --no-sensitive`,
or the CLI refuses them on Production.

### Turn off Deployment Protection

The project ships with Vercel Authentication on, which means anonymous visitors
get a login page instead of the site. For a public demo, disable it:

**Dashboard → Project → Settings → Deployment Protection → Vercel Authentication → Off**

There is no CLI flag for this. `vercel curl` only talks to deployments, not the
Vercel API, so this one step is manual. Verify with:

```bash
curl -sI https://wow-repo-aniruddha-adaks-projects.vercel.app | head -1
```

A `200` with your own HTML means it is public. A page titled "Login - Vercel"
means protection is still on.

## 4. Redeploying

| What changed     | What to run                          |
| ---------------- | ------------------------------------ |
| Source on `main` | push; Pages and CI run automatically |
| Pages only       | `gh workflow run pages.yml`          |
| Vercel only      | `vercel deploy --prod --yes`         |

## 5. Checks that gate a deploy

```bash
bun run check     # typecheck, lint, format check, tests, build
```

`bun run check` is the same list CI runs. If you change `content/`, the tests in
`content/*.test.ts` are what keep the dataset and the issue list honest.

## 6. Publishing the launch post

The draft is in [`docs/LAUNCH-POST.md`](./LAUNCH-POST.md), DEV-ready front matter
included (`published: false`, four canonical tags).

**Option A, no token: paste it.** Copy the body under the front matter into the
DEV editor. Set the tags to `nextjs`, `hacktoberfest`, `opensource`, `webdev`.
Once DEV assigns the slug, add the real `canonical_url` back to the front matter
in the repo.

**Option B, the DEV API.** Create a key at `dev.to/settings/extensions`, then:

```bash
curl -X POST https://dev.to/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "'"$DEV_API_KEY"'",
    "article": {
      "title": "I shipped a 108-entry agent registry and put it on two hosts...",
      "body_markdown": "'"$(cat docs/LAUNCH-POST.md | tail -n +6)"'",
      "published": true,
      "tags": ["nextjs", "hacktoberfest", "opensource", "webdev"]
    }
  }'
```

Keep the key in the environment, never in the repo. Set `"published": false`
first if you want a draft to review in the DEV editor.
