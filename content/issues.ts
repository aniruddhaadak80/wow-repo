/**
 * The first wave of good-first issues, as structured data.
 *
 * `docs/good-first-issues.md` holds the full GitHub issue bodies a maintainer
 * pastes in. This module is what the site renders, so the two stay in sync:
 * if a file moves here, the issue body is stale and `content/issues.test.ts`
 * will say so.
 *
 * Every path points at a real file in this repository, or is explicitly marked
 * `creates: true` when the issue asks the contributor to add one.
 */

export const ISSUE_LABELS = ['Design', 'Testing', 'Docs', 'Content'] as const

export type IssueLabel = (typeof ISSUE_LABELS)[number]

export interface IssuePath {
  /** Repository-relative path. */
  path: string
  /** Set when the issue asks the contributor to create this file. */
  creates?: boolean
}

export interface GoodFirstIssue {
  /** Stable id. Issue numbers are assigned by GitHub when these are filed. */
  id: string
  title: string
  label: IssueLabel
  /** An honest rough estimate. Not a promise, and deliberately not "5 min". */
  effort: string
  files: IssuePath[]
  summary: string
}

export const GOOD_FIRST_ISSUES: GoodFirstIssue[] = [
  {
    id: 'copy-install-from-card',
    title: 'Copy an install command from a catalog card',
    label: 'Design',
    effort: '~30 min',
    files: [{ path: 'components/skill-card.tsx' }, { path: 'components/copy-button.tsx' }],
    summary:
      'Reuse the existing CopyButton so a card copies its install command in one click, with the same feedback as the detail page.',
  },
  {
    id: 'keyboard-explorer',
    title: 'Keyboard-navigate the skills explorer',
    label: 'Design',
    effort: '~45 min',
    files: [
      { path: 'components/skills-explorer.tsx' },
      { path: 'components/skills-explorer.test.tsx', creates: true },
    ],
    summary:
      'Add arrow-key navigation and a visible focus state to the category chips, and keep the result count a live region.',
  },
  {
    id: 'registry-query-test',
    title: 'Cover the registry query layer with tests',
    label: 'Testing',
    effort: '~40 min',
    files: [{ path: 'lib/registry.ts' }, { path: 'lib/registry.test.ts', creates: true }],
    summary:
      'Test the query functions over the registry: search across kinds and triggers, craft filtering, related entries, and the empty-query case.',
  },
  {
    id: 'findings-query-test',
    title: 'Cover the findings query layer with unit tests',
    label: 'Testing',
    effort: '~40 min',
    files: [{ path: 'lib/findings.ts' }, { path: 'lib/findings.test.ts', creates: true }],
    summary:
      'Test the frontier log query layer against the real dataset: ordering, filtering, and the shape of the rows it hands the page.',
  },
  {
    id: 'reduced-motion-doc',
    title: 'Document the reduced-motion contract',
    label: 'Docs',
    effort: '~30 min',
    files: [
      { path: 'docs/reduced-motion.md', creates: true },
      { path: 'components/sections/manifesto.tsx' },
      { path: 'components/count-up.tsx' },
    ],
    summary:
      'Walk every animated component, record which ones gate behind useReducedMotion, and write the doc a maintainer can check later.',
  },
]

/** The label contributors filter by in GitHub issue search. */
export const GOOD_FIRST_ISSUE_LABEL = 'good first issue'
