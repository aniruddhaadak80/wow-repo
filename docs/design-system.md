# Design system

The site is one system, not a pile of sections. Every rule below is enforced by review, and the
ones that can be checked mechanically are noted with how to check them.

## Tokens

Tokens live in `app/globals.css` as CSS custom properties, mapped into Tailwind v4 through
`@theme inline`. There is no second source of truth for color.

| Token           | Light     | Dark      | Role                                               |
| --------------- | --------- | --------- | -------------------------------------------------- |
| `--bg`          | `#fafaf9` | `#0b0b0c` | Page background                                    |
| `--surface`     | `#ffffff` | `#131315` | Cards, console chrome, raised panels               |
| `--elevated`    | `#f4f4f2` | `#1a1a1d` | Inputs, hover fills, quiet tiles                   |
| `--ink`         | `#18181b` | `#f4f4f5` | Primary text                                       |
| `--muted`       | `#5b5b60` | `#a1a1aa` | Secondary text, labels                             |
| `--line`        | `#e6e6e3` | `#26262a` | Every hairline border                              |
| `--accent`      | `#4d7c0f` | `#bef264` | The one accent color                               |
| `--on-accent`   | `#ffffff` | `#1a2e05` | Text on top of the accent                          |
| `--accent-soft` | `#ecfccb` | 12% lime  | Tinted fills that must not read as a second accent |

Theme is chosen before first paint by an inline script in `app/layout.tsx` that reads
`localStorage` and falls back to `prefers-color-scheme`, then writes `data-theme` on `<html>`.
The toggle in the nav flips the same attribute. No section inverts the theme mid-page.

## Locks

- **Color.** One accent, applied identically in every section, in both themes. Negative deltas are
  muted grey, not red. Statuses that need a second hue are a bug.
- **Shape.** Pills (`rounded-full`) for interactive controls, `rounded-2xl` for cards and tiles,
  `rounded-lg` for chips and inputs. Documented at the top of `globals.css`.
- **Z-index.** `lib/constants.ts` owns a five-step scale: dropdown 100, sticky 200, overlay 300,
  modal 400, toast 500. Arbitrary `z-*` values are a review failure.
- **Motion.** `transform` and `opacity` only. `EASE = [0.16, 1, 0.3, 1]` is the single curve.
- **Typography.** Geist Sans for display and body, Geist Mono for anything numeric or machine-ish.
  No serif, no Inter, no second display face.

## Motion rules

1. Every animation needs a one-sentence reason: hierarchy, storytelling, feedback, or state
   transition. "It looked cool" is not a reason.
2. `MOTION_INTENSITY` here is 7 out of 10. The page must actually move, so entry transitions,
   scroll reveals, the typed CLI session, and the scoreboard count-ups all ship.
3. Everything above intensity 3 honours `prefers-reduced-motion`. In Motion that is
   `useReducedMotion()`; in CSS the global override block at the bottom of `globals.css`.
4. `window.addEventListener('scroll')` is banned. Use `useScroll`, `useInView`, `whileInView`,
   IntersectionObserver, or CSS scroll-driven animations.
5. Bars animate `scaleX`, never `width`, so the compositor does the work.

## Layout rules

- The hero is a split, not a centred stack, and fits the viewport: two-line headline, subtext
  under 20 words, CTA visible without scrolling.
- One layout family per section. Nine sections use seven different families.
- Bento grids have exactly as many cells as they have content, and at least two cells carry real
  visual variation.
- Eyebrows are rationed: one small-caps label per three sections, counted mechanically.
- One marquee per page. It is the stack wall under the hero.
- No scroll cues, no version stamps, no decorative dots, no "trusted by" theatre inside the hero,
  and no em-dashes in any user-visible string.

## Data presentation

- Comparison bars carry no background track. The fill is the whole signal.
- Sample data is labelled in the UI, not only in a comment. `content/benchmarks.ts` is synthetic
  harness-shaped data and says so on screen and in the file header.
- Long lists become a scoreboard, a card grid, or a filterable table. A 14-row `divide-y` list is
  a last resort, not a default.

## Pre-flight

Before shipping a page, run the checklist in the design skill (typography discipline, color and
shape locks, hero fit, eyebrow count, layout-family repetition, CTA intent, contrast, reduced
motion). A page that fails one box is not done.
