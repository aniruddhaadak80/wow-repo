# Hacktoberfest 2026

wow-repo is a good place to spend an October afternoon. It is a real Next.js site, it builds in under a minute, and the first five issues are already written, with the files and the acceptance criteria spelled out.

## Start here

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md). It is short and it sets the bar.
2. Pick one of the five [good first issues](./docs/good-first-issues.md). Each one names the files it touches and what "done" means.
3. Comment on the issue to claim it. If it is more than two days without a reply, it is fair game.
4. Run `bun run check` locally, then open a PR.

There are no onboarding tasks, no `first-contribution` labels with an out-of-date README to fix, and no "add your name to a list" issues. The issues change the product.

## The first wave

| #   | Issue                                       | Effort  | Files                            |
| --- | ------------------------------------------- | ------- | -------------------------------- |
| 1   | Copy an install command from a catalog card | ~30 min | `components/skill-card.tsx`      |
| 2   | Keyboard-navigate the skills explorer       | ~45 min | `components/skills-explorer.tsx` |
| 3   | Cover the registry query layer with tests   | ~40 min | `lib/registry.test.ts` (new)     |
| 4   | Cover the findings query layer with tests   | ~40 min | `lib/findings.test.ts` (new)     |
| 5   | Document the reduced-motion contract        | ~30 min | `docs/reduced-motion.md` (new)   |

Full bodies, checklists, and hints: [docs/good-first-issues.md](./docs/good-first-issues.md).

## What actually counts

Read [hacktoberfest.com](https://hacktoberfest.com/about/) for the official rules on what counts, what the deadline is, and how participation is tracked. This repo will not tell you a PR counts when it does not.

What we can say about this repo:

- Pull requests must be merged, or accepted by a maintainer, to count toward Hacktoberfest. Ask for a review; do not wait for a merge.
- Anything that adds a line to a list, or a blank README entry, will be closed.
- Issues that are genuinely hard are labelled, and the effort estimates above are honest. If one turns out to be bigger than it looked, say so in the thread.
- Reviews usually happen within a few days during October. If nobody has answered in a week, ping the thread once.

## After your first PR

The registry in `content/registry.ts` is the easiest thing to keep improving: one entry per PR, with a real command and a real URL. The harder, more interesting work is the benchmark pages and the design system tokens in `app/globals.css`.

## Code of conduct

Be decent. The [Contributor Covenant](https://www.contributor-covenant.org/) applies, and a maintainer can close a PR for conduct alone.
