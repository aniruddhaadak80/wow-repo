import { findings, FIELDS, TRACKS, type Field, type Finding, type Track } from '@/content/findings'

export { FIELDS, TRACKS }
export type { Field, Finding, Track }

export function getFindings(): Finding[] {
  return findings
}

export function getFindingBySlug(slug: string): Finding | undefined {
  return findings.find((finding) => finding.slug === slug)
}

export function getFindingsByTrack(track: Track): Finding[] {
  return findings.filter((finding) => finding.track === track)
}

export function getFindingsByField(field: Field): Finding[] {
  return findings.filter((finding) => finding.field === field)
}

export function getFeaturedFindings(count = 3): Finding[] {
  return findings.filter((finding) => finding.featured).slice(0, count)
}

export function getRelatedFindings(finding: Finding, count = 2): Finding[] {
  const sameTrack = findings.filter((f) => f.track === finding.track && f.slug !== finding.slug)
  const others = findings.filter((f) => f.track !== finding.track && f.slug !== finding.slug)
  return [...sameTrack, ...others].slice(0, count)
}

export function searchFindings(query: string): Finding[] {
  const q = query.trim().toLowerCase()
  if (!q) return findings
  return findings.filter(
    (finding) =>
      finding.title.toLowerCase().includes(q) ||
      finding.summary.toLowerCase().includes(q) ||
      finding.detail.toLowerCase().includes(q) ||
      finding.org.toLowerCase().includes(q) ||
      finding.field.toLowerCase().includes(q) ||
      finding.source.label.toLowerCase().includes(q),
  )
}

export function getFindingSlugs(): string[] {
  return findings.map((finding) => finding.slug)
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

/**
 * Renders a date at the precision it was recorded with.
 * '2026-04-02' -> '2 April 2026', '2026-04' -> 'April 2026', '2026' -> '2026'.
 */
export function formatFindingDate(date: string): string {
  const [year, month, day] = date.split('-')
  if (!month) return year
  const monthName = MONTHS[Number(month) - 1] ?? month
  if (!day) return `${monthName} ${year}`
  return `${Number(day)} ${monthName} ${year}`
}

/** Sort key that keeps year-only and month-only dates comparable. */
export function findingSortKey(date: string): number {
  const [year, month, day] = date.split('-')
  return Number(year) * 10000 + Number(month ?? 1) * 100 + Number(day ?? 1)
}

/** Newest first. */
export function sortFindingsByDate(list: Finding[] = findings): Finding[] {
  return [...list].sort((a, b) => findingSortKey(b.date) - findingSortKey(a.date))
}
