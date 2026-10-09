# Contributing

Thanks for taking the time. This repo is a showcase as much as a product, so the bar for a merge is "would this make a stranger say wow, and can the next person maintain it".

New here? Start with [HACKTOBERFEST.md](./HACKTOBERFEST.md) and pick one of the five [good first issues](./docs/good-first-issues.md). They are scoped to a file or two, with the acceptance criteria already written.

## Ground rules

- One logical change per PR. Refactors and features do not mix.
- `bun run check` (or `npm run check`) must pass before you open a PR. That is typecheck, lint, format check, tests, and a production build.
- No secrets, no `.env.local` values, no generated artifacts.
- If you add data to `content/`, add the test that keeps it honest.

## Local setup

```bash
bun install
bun run dev          # http://localhost:3000
bun run test         # one pass (watch forever: bun run test:watch)
bun run check        # typecheck, lint, format, tests, and a production build
```

npm works too, if that is your thing.

## What a good change looks like here

**A design change** states which rule it serves. The site keeps one accent color, one radius
scale, one marquee, one z-index scale, and a hard budget of one small-caps eyebrow per three
sections. If your change adds a second of any of those, it needs an argument.

**A new section** goes in `components/sections/` as a Server Component, with its interactive
parts split into client leaves under `components/`. Say what the animation communicates. If the
answer is "it looked nice", drop the animation.

**A data change** starts in `content/` and is read through `lib/`. Scores, counts, and dates that
are not real measurements must be labelled as sample data in the UI and covered by a test.

**A motion change** uses `transform` or `opacity`, honours `prefers-reduced-motion`, and never
attaches a `scroll` listener. `useScroll`, `useInView`, `whileInView`, or CSS scroll-driven
animations only.

## Commit style

Conventional commits, lowercase, imperative: `feat: add benchmark track filter`,
`fix: stop the manifesto from painting before hydration`, `test: cover tied ranks`.

## Accessibility is part of "done"

- Every control has a label, a visible focus ring, and a hit area of at least 36px.
- Custom widgets carry the ARIA they need: the track filter is a group of `aria-pressed`
  buttons, the rows are `aria-expanded` disclosures, the result count is a live region.
- Text passes WCAG AA against its own background in both light and dark mode.

## Reporting a bug

Open an issue with what you did, what you expected, and what you got. A screenshot of the broken
state saves a round trip.
