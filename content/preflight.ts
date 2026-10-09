/**
 * The pre-flight ledger.
 *
 * Every rule below is enforced in this repository and can be checked by hand
 * against the file named in `where`. Nothing here is aspirational: if a rule
 * stops being true, remove the row.
 */

export interface RuleItem {
  id: string
  rule: string
  where: string
}

export interface RuleGroupShape {
  id: string
  label: string
  summary: string
  rules: RuleItem[]
}

export const RULE_GROUPS: RuleGroupShape[] = [
  {
    id: 'typography',
    label: 'Typography',
    summary: 'One sans family, mono for data, no display serif.',
    rules: [
      {
        id: 'type-family',
        rule: 'Geist and Geist Mono, self-hosted through next/font with display swap.',
        where: 'app/layout.tsx',
      },
      {
        id: 'type-measure',
        rule: 'Body copy is capped at 65 characters so line length holds on wide screens.',
        where: 'components/sections/*',
      },
      {
        id: 'type-mono',
        rule: 'Mono is reserved for data: commands, counts, file paths, and labels.',
        where: 'app/globals.css',
      },
      {
        id: 'type-emphasis',
        rule: 'Emphasis inside a headline stays in the same family, weight, or italic.',
        where: 'components/sections/hero.tsx',
      },
    ],
  },
  {
    id: 'color',
    label: 'Color',
    summary: 'One accent, one neutral family, both modes.',
    rules: [
      {
        id: 'color-single-accent',
        rule: 'Lime is the only accent. It appears in every mode and no second hue replaces it.',
        where: 'app/globals.css',
      },
      {
        id: 'color-neutrals',
        rule: 'Neutrals stay in the zinc family. No warm grey sits next to a cool grey.',
        where: 'app/globals.css',
      },
      {
        id: 'color-on-accent',
        rule: 'Accent surfaces carry an on-accent token, so label contrast holds in both modes.',
        where: 'app/globals.css',
      },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    summary: 'Asymmetry with a hard collapse for mobile.',
    rules: [
      {
        id: 'layout-hero-viewport',
        rule: 'The hero fits the first viewport: two-line headline, subtext under 20 words, CTA visible.',
        where: 'components/sections/hero.tsx',
      },
      {
        id: 'layout-no-three-cards',
        rule: 'No row of three identical feature cards anywhere on the page.',
        where: 'components/sections/*',
      },
      {
        id: 'layout-bento-cells',
        rule: 'Bento cell count matches content count. No empty tile at the end of a row.',
        where: 'components/sections/catalog-bento.tsx',
      },
      {
        id: 'layout-families',
        rule: 'The page uses at least five distinct section layout families, with no family repeated.',
        where: 'app/page.tsx',
      },
      {
        id: 'layout-mobile',
        rule: 'Every multi-column grid declares its collapse to a single column below 768px.',
        where: 'components/sections/*',
      },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    summary: 'Motivated, composable, and honest under reduced motion.',
    rules: [
      {
        id: 'motion-motivated',
        rule: 'Each animation answers one question: hierarchy, storytelling, feedback, or state change.',
        where: 'components/sections/manifesto.tsx',
      },
      {
        id: 'motion-no-scroll-listener',
        rule: 'Scroll state comes from useScroll or IntersectionObserver. No window scroll listeners.',
        where: 'components/nav.tsx',
      },
      {
        id: 'motion-reduced',
        rule: 'prefers-reduced-motion collapses every animation, marquee, and count-up to static.',
        where: 'app/globals.css',
      },
      {
        id: 'motion-no-frame-state',
        rule: 'Per-frame values write to the DOM through refs. React never re-renders per frame.',
        where: 'components/count-up.tsx',
      },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    summary: 'Copy that survives a second read.',
    rules: [
      {
        id: 'content-no-em-dash',
        rule: 'No em-dashes or en-dashes in visible copy. Hyphens and periods instead.',
        where: 'all components',
      },
      {
        id: 'content-no-fake-metrics',
        rule: 'No invented percentages or counts. Numbers on the page are real or labelled as targets.',
        where: 'content/benchmarks.ts',
      },
      {
        id: 'content-eyebrow-budget',
        rule: 'At most one small-caps label per three sections. Most sections have none.',
        where: 'app/page.tsx',
      },
      {
        id: 'content-quotes',
        rule: 'Quotes stay under three lines and carry a name plus a role.',
        where: 'components/sections/faq.tsx',
      },
      {
        id: 'content-no-fake-terminal',
        rule: 'No fake windows: no traffic-light dots, no invented CLI sessions, no mock screenshots.',
        where: 'components/sections/hero.tsx',
      },
    ],
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    summary: 'Keyboard first, contrast always.',
    rules: [
      {
        id: 'a11y-visible-label',
        rule: 'Every input has a visible label above it. No placeholder standing in for a label.',
        where: 'components/catalog-search.tsx',
      },
      {
        id: 'a11y-focus-ring',
        rule: 'Focus rings use the accent token and stay visible in both modes.',
        where: 'app/globals.css',
      },
      {
        id: 'a11y-palette-focus',
        rule: 'The command palette traps Tab, closes on Escape, and returns focus to its trigger.',
        where: 'components/command-palette.tsx',
      },
      {
        id: 'a11y-skip-link',
        rule: 'A skip-to-content link is the first stop in the tab order.',
        where: 'app/layout.tsx',
      },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    summary: 'Budgets, not hopes.',
    rules: [
      {
        id: 'perf-static-catalog',
        rule: 'Every skill route is statically generated from generateStaticParams.',
        where: 'app/skills/[slug]/page.tsx',
      },
      {
        id: 'perf-images',
        rule: 'Images declare sizes, ship as AVIF or WebP, and reserve their box to protect CLS.',
        where: 'components/sections/catalog-bento.tsx',
      },
      {
        id: 'perf-headers',
        rule: 'Security and cache headers are set in next.config, not left to platform defaults.',
        where: 'next.config.ts',
      },
    ],
  },
] as const

export type RuleGroup = RuleGroupShape
export type Rule = RuleItem

export const ALL_RULES: ReadonlyArray<Rule & { group: string; groupLabel: string }> =
  RULE_GROUPS.flatMap((group) =>
    group.rules.map((rule) => ({ ...rule, group: group.id, groupLabel: group.label })),
  )

export const RULE_COUNT = ALL_RULES.length

export const GROUP_COUNT = RULE_GROUPS.length
