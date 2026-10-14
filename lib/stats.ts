import { CRAFTS, KINDS, entries, type Craft, type Kind } from '@/content/registry'
import type { RegistryEntry } from '@/content/registry'

/**
 * Registry analytics, computed from the catalog rather than typed by hand.
 *
 * Every number on /stats comes from here. Nothing is invented: counts are
 * counts, shares are shares of the real total, and the timeline is built
 * from the sample catalog dates (the UI says so, per the repo rule).
 */

export interface NamedCount {
  key: string
  label: string
  count: number
  share: number
}

function withShares<T extends { count: number }>(rows: T[]): Array<T & { share: number }> {
  const total = rows.reduce((sum, row) => sum + row.count, 0)
  return rows.map((row) => ({ ...row, share: total === 0 ? 0 : row.count / total }))
}

/** Entries per kind, largest first, with the kind label for display. */
export function getKindStats(): NamedCount[] {
  return withShares(
    KINDS.map((kind) => ({
      key: kind,
      label: kind,
      count: entries.filter((entry) => entry.kind === kind).length,
    })),
  ).sort((a, b) => b.count - a.count)
}

/** Entries per craft, largest first. */
export function getCraftStats(): NamedCount[] {
  return withShares(
    CRAFTS.map((craft) => ({
      key: craft,
      label: craft,
      count: entries.filter((entry) => entry.craft === craft).length,
    })),
  ).sort((a, b) => b.count - a.count)
}

export interface MonthBucket {
  /** YYYY-MM, for keys and sorting. */
  month: string
  /** 'Sep 2026', for display. */
  label: string
  count: number
}

function monthLabel(month: string): string {
  const [year, mm] = month.split('-')
  const date = new Date(`${month}-01T00:00:00Z`)
  return `${date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })} ${year}`
}

/**
 * Entries per month across the whole catalog, with empty months filled so
 * the chart shows the real rhythm (and the quiet months) rather than a
 * misleading sequence of only the busy ones.
 */
export function getAddedTimeline(): MonthBucket[] {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    const month = entry.addedAt.slice(0, 7)
    counts.set(month, (counts.get(month) ?? 0) + 1)
  }
  if (counts.size === 0) return []

  const months = [...counts.keys()].sort()
  const first = months[0]
  const last = months[months.length - 1]
  const [firstYear, firstMonth] = first.split('-').map(Number)
  const [lastYear, lastMonth] = last.split('-').map(Number)

  const buckets: MonthBucket[] = []
  let year = firstYear
  let month = firstMonth
  while (year < lastYear || (year === lastYear && month <= lastMonth)) {
    const key = `${year}-${String(month).padStart(2, '0')}`
    buckets.push({ month: key, label: monthLabel(key), count: counts.get(key) ?? 0 })
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return buckets
}

export interface LicenseCount {
  license: string
  count: number
  share: number
}

/** License distribution, with the unlicensed ones named honestly. */
export function getLicenseStats(): LicenseCount[] {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    const license = entry.license?.trim() || 'see source'
    counts.set(license, (counts.get(license) ?? 0) + 1)
  }
  return withShares(
    [...counts.entries()]
      .map(([license, count]) => ({ license, count }))
      .sort((a, b) => b.count - a.count),
  )
}

export interface MatrixRow {
  craft: Craft
  label: string
  counts: Record<Kind, number>
  total: number
}

/** Craft by kind, so the shape of the catalog is visible at a glance. */
export function getCraftKindMatrix(): MatrixRow[] {
  return CRAFTS.map((craft) => {
    const counts = Object.fromEntries(KINDS.map((kind) => [kind, 0])) as Record<Kind, number>
    for (const entry of entries) {
      if (entry.craft === craft) counts[entry.kind] += 1
    }
    return {
      craft,
      label: craft,
      counts,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0),
    }
  }).sort((a, b) => b.total - a.total)
}

/** Newest entries by catalog date, newest first. */
export function getNewestEntries(count = 6): RegistryEntry[] {
  return [...entries].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, count)
}

/** The triggers that surface the most entries, most useful first. */
export function getTopTriggers(count = 8): Array<{ trigger: string; count: number }> {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    for (const trigger of entry.triggers) {
      counts.set(trigger, (counts.get(trigger) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([trigger, total]) => ({ trigger, count: total }))
    .sort((a, b) => b.count - a.count || a.trigger.localeCompare(b.trigger))
    .slice(0, count)
}

export interface RegistrySummary {
  total: number
  kinds: number
  crafts: number
  skills: number
  featured: number
  licensed: number
  months: number
  busiestMonth: MonthBucket | null
}

/** The headline numbers, all derived. */
export function getRegistrySummary(): RegistrySummary {
  const timeline = getAddedTimeline()
  const busiest = timeline.reduce<MonthBucket | null>(
    (best, bucket) => (best === null || bucket.count > best.count ? bucket : best),
    null,
  )

  return {
    total: entries.length,
    kinds: KINDS.length,
    crafts: CRAFTS.length,
    skills: entries.filter((entry) => entry.kind === 'skill').length,
    featured: entries.filter((entry) => entry.featured).length,
    licensed: entries.filter((entry) => entry.license).length,
    months: timeline.length,
    busiestMonth: busiest,
  }
}
