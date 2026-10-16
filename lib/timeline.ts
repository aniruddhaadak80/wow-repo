import { entries, type RegistryEntry } from '@/content/registry'

/**
 * The catalog as a chronology.
 *
 * /stats shows the shape of the registry (counts, shares, a chart). This module
 * shows the sequence: what landed when, month by month, newest first. It reads
 * the same sample `addedAt` dates the rest of the site does, and the page says
 * so, because those dates are catalog fixtures rather than real publish times.
 */

export interface TimelineMonth {
  /** YYYY-MM, for keys and sorting. */
  month: string
  /** 'October 2026', for display. */
  label: string
  entries: RegistryEntry[]
}

export interface TimelineYear {
  year: string
  count: number
  months: TimelineMonth[]
}

function monthLabel(month: string): string {
  const [year] = month.split('-')
  const date = new Date(`${month}-01T00:00:00Z`)
  return `${date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })} ${year}`
}

/** Entries grouped by year then month, newest first at both levels. */
export function getTimeline(): TimelineYear[] {
  const months = new Map<string, RegistryEntry[]>()
  for (const entry of entries) {
    const month = entry.addedAt.slice(0, 7)
    const list = months.get(month)
    if (list) list.push(entry)
    else months.set(month, [entry])
  }

  const years = new Map<string, TimelineYear>()
  const orderedMonths = [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]))

  for (const [month, list] of orderedMonths) {
    const year = month.slice(0, 4)
    const sorted = [...list].sort(
      (a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name),
    )
    const bucket = years.get(year) ?? { year, count: 0, months: [] }
    bucket.months.push({ month, label: monthLabel(month), entries: sorted })
    bucket.count += sorted.length
    years.set(year, bucket)
  }

  return [...years.values()].sort((a, b) => b.year.localeCompare(a.year))
}

export interface TimelineSummary {
  years: number
  months: number
  total: number
  first: string
  last: string
  busiest: { month: string; label: string; count: number } | null
}

/** Headline numbers for the timeline header, all derived. */
export function getTimelineSummary(): TimelineSummary {
  const timeline = getTimeline()
  const flat = timeline.flatMap((year) => year.months)
  const busiest = flat.reduce<{ month: string; label: string; count: number } | null>(
    (best, entry) =>
      best === null || entry.entries.length > best.count
        ? { month: entry.month, label: entry.label, count: entry.entries.length }
        : best,
    null,
  )
  const months = flat.map((entry) => entry.month).sort()

  return {
    years: timeline.length,
    months: flat.length,
    total: entries.length,
    first: months[0] ?? '',
    last: months[months.length - 1] ?? '',
    busiest,
  }
}

/** Format a YYYY-MM month as 'October 2026'. */
export function formatMonth(month: string): string {
  return monthLabel(month)
}
