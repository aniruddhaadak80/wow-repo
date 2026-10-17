import type { Craft, Kind } from '@/content/registry'

/**
 * The stack chooser: a small, explainable recommendation engine over the
 * registry.
 *
 * The whole point is that it is not a black box. Every entry that surfaces
 * carries the reasons it surfaced, and the reasons are the scoring rules read
 * back out loud. The scoring is deterministic: same answers, same list, which
 * is what makes it testable and what keeps the UI honest.
 *
 * This module is deliberately free of any runtime registry import, so the
 * client island can score without dragging the catalog across the wire. The
 * registry-backed helpers live in `chooser-catalog.ts` for the server only.
 */

export type ChooserGoal =
  'ship-ui' | 'connect-data' | 'automate' | 'research' | 'multimedia' | 'self-host'

/**
 * The slice of an entry the chooser actually reads. `kindLabel` travels with the
 * row so the island can name a kind without importing `KIND_META`.
 */
export interface ChooserEntry {
  slug: string
  name: string
  kind: Kind
  /** Human label for the kind, copied from KIND_META on the server. */
  kindLabel: string
  craft: Craft
  tagline: string
  command: string
  license?: string
  featured?: boolean
}

export interface GoalMeta {
  id: ChooserGoal
  label: string
  blurb: string
  crafts: Craft[]
  kinds: Kind[]
}

/** What each goal pulls toward. Deliberately coarse: this is a signpost, not a ranking. */
export const CHOOSER_GOALS: GoalMeta[] = [
  {
    id: 'ship-ui',
    label: 'Ship a polished interface',
    blurb: 'Design review, colour discipline, and the checks that catch AI-defaults.',
    crafts: ['Design'],
    kinds: ['skill', 'harness'],
  },
  {
    id: 'connect-data',
    label: 'Connect an agent to data',
    blurb: 'Tool servers and APIs that let an agent read and write the outside world.',
    crafts: ['DevEx', 'Research'],
    kinds: ['mcp', 'api'],
  },
  {
    id: 'automate',
    label: 'Automate a workflow',
    blurb: 'The loop, the tools, and the runtimes that carry a task end to end.',
    crafts: ['DevEx'],
    kinds: ['mcp', 'harness', 'software'],
  },
  {
    id: 'research',
    label: 'Research and write',
    blurb: 'Search, retrieval, and the sources worth citing.',
    crafts: ['Research', 'Content'],
    kinds: ['api', 'software', 'mcp'],
  },
  {
    id: 'multimedia',
    label: 'Create media',
    blurb: 'Specs and APIs for images, video, and everything that ships as a file.',
    crafts: ['Multimedia', 'Content'],
    kinds: ['skill', 'api'],
  },
  {
    id: 'self-host',
    label: 'Self-host the stack',
    blurb: 'Open software you run yourself, with no vendor between you and the model.',
    crafts: ['DevEx'],
    kinds: ['software', 'harness', 'protocol'],
  },
]

export interface ChooserAnswers {
  goal: ChooserGoal
  /** Optional: lock to a craft the reader already knows they want. */
  craft?: Craft | null
  /** Optional: the kinds they are willing to run. Empty means any. */
  kinds?: Kind[]
  /** 'open' nudges toward entries with a stated licence. */
  licence?: 'any' | 'open'
}

export interface ChooserRecommendation {
  entry: ChooserEntry
  score: number
  reasons: string[]
}

export function getGoal(id: ChooserGoal): GoalMeta {
  return CHOOSER_GOALS.find((goal) => goal.id === id) ?? CHOOSER_GOALS[0]
}

interface Scored {
  entry: ChooserEntry
  score: number
  reasons: string[]
}

function scoreEntry(entry: ChooserEntry, answers: ChooserAnswers): Scored {
  const goal = getGoal(answers.goal)
  const reasons: string[] = []
  let score = 0

  if (goal.crafts.includes(entry.craft)) {
    score += 3
    reasons.push(`fits the ${entry.craft} craft this goal leans on`)
  }
  if (goal.kinds.includes(entry.kind)) {
    score += 2
    reasons.push(`is a ${entry.kindLabel.toLowerCase()}, which this goal runs`)
  }
  if (answers.craft && entry.craft === answers.craft) {
    score += 4
    reasons.push(`matches the ${answers.craft} craft you picked`)
  }
  if (answers.kinds && answers.kinds.length > 0 && answers.kinds.includes(entry.kind)) {
    score += 4
    reasons.push('matches a kind you are willing to run')
  }
  if (answers.licence === 'open') {
    if (entry.license) {
      score += 3
      reasons.push(`states a ${entry.license} licence`)
    } else {
      score -= 3
      reasons.push('has no stated licence, which your filter avoids')
    }
  }
  if (entry.featured) {
    score += 1
    reasons.push('is featured in the catalog')
  }

  return { entry, score, reasons }
}

/**
 * The shortlist. Ties break on name so the same answers always give the same
 * order, and entries that score at or below zero are dropped rather than padded
 * in to hit the count.
 */
export function recommendStack(
  answers: ChooserAnswers,
  count: number,
  catalog: ChooserEntry[],
): ChooserRecommendation[] {
  return catalog
    .map((entry) => scoreEntry(entry, answers))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .slice(0, count)
    .map((row) => ({ entry: row.entry, score: row.score, reasons: row.reasons }))
}

/** A runnable starter script from a shortlist. Honest about being a sample. */
export function buildSetupScript(recommendations: ChooserRecommendation[]): string {
  const header = [
    '#!/usr/bin/env bash',
    '# wow-repo starter stack',
    '# Generated from the demo catalog. Each command is a sample: read it before you run it.',
    'set -euo pipefail',
    '',
  ]
  const body = recommendations.flatMap(({ entry }) => [
    `# ${entry.name}: ${entry.tagline}`,
    entry.command,
    '',
  ])
  return [...header, ...body].join('\n').trimEnd() + '\n'
}

/** The same shortlist as Markdown, for pasting into an issue or a plan. */
export function buildStackMarkdown(recommendations: ChooserRecommendation[]): string {
  return recommendations
    .map(({ entry, reasons }) => {
      const why = reasons.length > 0 ? ` (${reasons.join('; ')})` : ''
      return `- **${entry.name}** [${entry.kindLabel}, ${entry.craft}]${why}: \`${entry.command}\``
    })
    .join('\n')
}
