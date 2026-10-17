/**
 * The changelog: how the site got here, read straight from the commit history.
 *
 * Each release maps to a real wave of commits, so this file stays short and
 * honest rather than inventing a version history. Dates are the commit dates.
 */

export type ChangelogTag = 'feature' | 'fix' | 'docs' | 'quality' | 'ci'

export interface ChangelogEntry {
  id: string
  text: string
  tag: ChangelogTag
}

export interface ChangelogRelease {
  version: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  title: string
  summary: string
  entries: ChangelogEntry[]
}

export const CHANGELOG: ChangelogRelease[] = [
  {
    version: '1.7.0',
    date: '2026-10-16',
    title: 'Taxonomy, timeline, chooser, and a relationship map',
    summary:
      'The registry can now be browsed by craft, by kind, and by arrival, and there is an engine that recommends a stack out loud.',
    entries: [
      {
        id: 'crafts',
        text: 'Craft and kind pages that group the catalog and cross-link honestly.',
        tag: 'feature',
      },
      {
        id: 'timeline',
        text: 'A timeline of every entry, month by month, newest first.',
        tag: 'feature',
      },
      {
        id: 'chooser',
        text: 'A stack chooser that scores entries and explains every reason it surfaced.',
        tag: 'feature',
      },
      {
        id: 'graph',
        text: 'A relationship map of triggers that travel together across entries.',
        tag: 'feature',
      },
      {
        id: 'quiz',
        text: 'A seeded glossary quiz generated from the same definitions the site renders.',
        tag: 'feature',
      },
      { id: 'changelog', text: 'This page, kept in step with the commits.', tag: 'docs' },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-10-15',
    title: 'A bigger catalog with shareable filters',
    summary:
      'The registry grew past a hundred entries, and the explorer started writing its filters into the URL.',
    entries: [
      {
        id: 'registry-128',
        text: 'Registry broadened to 128 entries across all six kinds.',
        tag: 'feature',
      },
      {
        id: 'url-filters',
        text: 'Explorer filters synced to the URL, so a filtered view is shareable.',
        tag: 'feature',
      },
      {
        id: 'prerender',
        text: 'Kept the registry grid in the prerendered HTML for a faster first paint.',
        tag: 'fix',
      },
      {
        id: 'grid-overflow',
        text: 'Stopped grid items overflowing the mobile viewport.',
        tag: 'fix',
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-10-14',
    title: 'Glossary, analytics, and a saved shelf',
    summary:
      'The site learned its own vocabulary, counted itself, and started remembering what you saved.',
    entries: [
      {
        id: 'glossary',
        text: 'Searchable glossary of the open agent stack, built from typed definitions.',
        tag: 'feature',
      },
      {
        id: 'stats',
        text: 'A stats page computed from the catalog, not typed by hand.',
        tag: 'feature',
      },
      {
        id: 'bookmarks',
        text: 'Local bookmarks with a share button and a saved tab on mobile.',
        tag: 'feature',
      },
      {
        id: 'screenshots',
        text: 'Docs refreshed with screenshots of the new surfaces.',
        tag: 'docs',
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-10-10',
    title: 'A README that reads like a tour',
    summary: 'A skill-sort README, a calmer Lighthouse gate, and a mobile overflow fix.',
    entries: [
      {
        id: 'readme',
        text: 'Skill-sort README with screenshots, diagrams, and community files.',
        tag: 'docs',
      },
      {
        id: 'lighthouse-median',
        text: 'Lighthouse asserted on the median of three runs to absorb runner noise.',
        tag: 'ci',
      },
      { id: 'mobile-overflow', text: 'Fixed the grid overflowing narrow viewports.', tag: 'fix' },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-10-09',
    title: 'The site becomes a site',
    summary:
      'Compare, docs, RSS, shortcuts, a second deploy target, and an accessibility pass that cleared every Lighthouse finding.',
    entries: [
      {
        id: 'compare',
        text: 'A compare view, a docs index, a random entry, and RSS.',
        tag: 'feature',
      },
      { id: 'after', text: 'The After the world superintelligence section.', tag: 'feature' },
      { id: 'pages', text: 'A GitHub Pages static export alongside the Vercel build.', tag: 'ci' },
      {
        id: 'a11y',
        text: 'Cleared every Lighthouse accessibility finding and re-audited on desktop.',
        tag: 'quality',
      },
      {
        id: 'benchmark',
        text: 'Agent skills showcase with a benchmark scoreboard.',
        tag: 'feature',
      },
    ],
  },
]

/** Newest first. */
export function getReleases(): ChangelogRelease[] {
  return [...CHANGELOG].sort((a, b) => b.date.localeCompare(a.date))
}

export interface ChangelogStats {
  releases: number
  latest: string
  date: string
  entries: number
}

/** Headline numbers for the page header. */
export function getChangelogStats(): ChangelogStats {
  const releases = getReleases()
  return {
    releases: releases.length,
    latest: releases[0]?.version ?? '',
    date: releases[0]?.date ?? '',
    entries: releases.reduce((total, release) => total + release.entries.length, 0),
  }
}
