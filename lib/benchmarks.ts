import {
  benchmarkEntries,
  BENCHMARK_TRACKS,
  type BenchmarkEntry,
  type BenchmarkTrack,
} from '@/content/benchmarks'

export { BENCHMARK_TRACKS }
export type { BenchmarkEntry, BenchmarkTrack }

export type TrackFilter = 'all' | BenchmarkTrack

export type SortKey = 'score' | 'delta' | 'latency' | 'cost' | 'name'

export interface SortOption {
  key: SortKey
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { key: 'score', label: 'Score' },
  { key: 'delta', label: 'Change' },
  { key: 'latency', label: 'Latency' },
  { key: 'cost', label: 'Cost' },
  { key: 'name', label: 'Name' },
]

export interface RankedEntry extends BenchmarkEntry {
  /** Competition ranking: equal scores share a rank, the next rank skips. */
  rank: number
}

export function getBenchmarkEntries(): BenchmarkEntry[] {
  return benchmarkEntries
}

export function getEntryById(id: string): BenchmarkEntry | undefined {
  return benchmarkEntries.find((entry) => entry.id === id)
}

export function getTrackCount(track: BenchmarkTrack): number {
  return benchmarkEntries.filter((entry) => entry.track === track).length
}

export function filterByTrack(entries: BenchmarkEntry[], track: TrackFilter): BenchmarkEntry[] {
  if (track === 'all') return entries
  return entries.filter((entry) => entry.track === track)
}

export function searchEntries(entries: BenchmarkEntry[], query: string): BenchmarkEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return entries
  return entries.filter(
    (entry) =>
      entry.name.toLowerCase().includes(q) ||
      entry.org.toLowerCase().includes(q) ||
      entry.breakdown.some((item) => item.label.toLowerCase().includes(q)),
  )
}

/** Ascending sort for latency and cost (lower is better), descending for the rest. */
export function sortEntries(entries: BenchmarkEntry[], key: SortKey): BenchmarkEntry[] {
  const sorted = [...entries]
  sorted.sort((a, b) => {
    switch (key) {
      case 'latency':
        return a.latency - b.latency
      case 'cost':
        return a.cost - b.cost
      case 'name':
        return a.name.localeCompare(b.name)
      case 'delta':
        return b.delta - a.delta
      default:
        return b.score - a.score
    }
  })
  return sorted
}

/**
 * Ranks are computed on score only, so filtering or re-sorting the table never
 * renumbers the rows. Ties share a rank and the following rank skips.
 */
export function rankEntries(entries: BenchmarkEntry[]): RankedEntry[] {
  const byScore = [...entries].sort((a, b) => b.score - a.score)
  let lastScore = Number.NaN
  let lastRank = 0
  return entries.map((entry) => {
    if (entry.score !== lastScore) {
      lastRank = byScore.indexOf(entry) + 1
      lastScore = entry.score
    }
    return { ...entry, rank: lastRank }
  })
}

export interface BenchmarkSummary {
  runs: number
  best: number
  median: number
  leader: string
}

export function summarize(entries: BenchmarkEntry[]): BenchmarkSummary {
  if (entries.length === 0) return { runs: 0, best: 0, median: 0, leader: '-' }
  const scores = entries.map((entry) => entry.score).sort((a, b) => a - b)
  const mid = Math.floor(scores.length / 2)
  const median = scores.length % 2 === 0 ? (scores[mid - 1] + scores[mid]) / 2 : scores[mid]
  const best = scores[scores.length - 1]
  const leader = entries.reduce((top, entry) => (entry.score > top.score ? entry : top))
  return { runs: entries.length, best, median, leader: leader.name }
}

export function formatScore(value: number): string {
  return value.toFixed(1)
}

export function formatDelta(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${Math.abs(value).toFixed(1)}`
}

export function formatLatency(seconds: number): string {
  return `${seconds.toFixed(1)}s`
}

export function formatCost(usd: number): string {
  return `$${usd.toFixed(2)}`
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** True when every track in the dataset has at least one entry. */
export function hasAllTracks(): boolean {
  return BENCHMARK_TRACKS.every((track) => getTrackCount(track) > 0)
}

/** Route params for `generateStaticParams` on /benchmarks/[id]. */
export function getBenchmarkIds(): string[] {
  return benchmarkEntries.map((entry) => entry.id)
}

/**
 * Same-track entries first, then the other track, ranked by score. Neighbours
 * on a detail page should be the runs a reader would actually compare against.
 */
export function getRelatedEntries(entry: BenchmarkEntry, count = 4): BenchmarkEntry[] {
  const sameTrack = benchmarkEntries.filter(
    (other) => other.track === entry.track && other.id !== entry.id,
  )
  const otherTrack = benchmarkEntries.filter(
    (other) => other.track !== entry.track && other.id !== entry.id,
  )
  const byScore = (a: BenchmarkEntry, b: BenchmarkEntry) => b.score - a.score
  return [...sameTrack.sort(byScore), ...otherTrack.sort(byScore)].slice(0, count)
}

/** Every distinct suite label in the dataset, in first-seen order. */
export function getSuiteLabels(entries: BenchmarkEntry[] = benchmarkEntries): string[] {
  const seen = new Set<string>()
  for (const entry of entries) {
    for (const item of entry.breakdown) seen.add(item.label)
  }
  return [...seen]
}

export interface SuiteLeader {
  label: string
  leader: BenchmarkEntry
  /** Spread between the best and worst score for that suite, in points. */
  spread: number
}

/** Who wins each suite, and how tightly the field is packed. */
export function getSuiteLeaders(entries: BenchmarkEntry[]): SuiteLeader[] {
  return getSuiteLabels(entries).map((label) => {
    const scored = entries
      .filter((entry) => entry.breakdown.some((item) => item.label === label))
      .map((entry) => ({
        entry,
        score: entry.breakdown.find((item) => item.label === label)!.score,
      }))
      .sort((a, b) => b.score - a.score)

    const best = scored[0]
    const worst = scored[scored.length - 1]
    return { label, leader: best.entry, spread: best.score - worst.score }
  })
}

/**
 * Score earned per cent spent. Higher is better. Guards the division so a
 * free entry cannot produce Infinity.
 */
export function efficiency(entry: BenchmarkEntry): number {
  if (entry.cost <= 0) return Number.POSITIVE_INFINITY
  return entry.score / entry.cost
}

/** True when the entry is the strongest score-per-dollar in its track. */
export function isEfficientLeader(entry: BenchmarkEntry): boolean {
  const contenders = benchmarkEntries.filter((other) => other.track === entry.track)
  if (contenders.length === 0) return false
  return contenders.every((other) => efficiency(other) <= efficiency(entry))
}
