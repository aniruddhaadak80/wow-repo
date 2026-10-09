import {
  entries,
  KINDS,
  KIND_META,
  TOPICS,
  type AfterEntry,
  type Kind,
  type Topic,
} from '@/content/superintelligence'
import { formatFindingDate } from '@/lib/findings'

export { KINDS, KIND_META, TOPICS }
export type { AfterEntry, Kind, Topic }

/** Date rendering honors recorded precision. Shared with the frontier log. */
export { formatFindingDate as formatAfterDate }

export function getAfterEntries(): AfterEntry[] {
  return entries
}

export function getAfterEntryBySlug(slug: string): AfterEntry | undefined {
  return entries.find((entry) => entry.slug === slug)
}

export function getAfterEntriesByKind(kind: Kind): AfterEntry[] {
  return entries.filter((entry) => entry.kind === kind)
}

export function getAfterEntriesByTopic(topic: Topic): AfterEntry[] {
  return entries.filter((entry) => entry.topic === topic)
}

export function getAfterSlugs(): string[] {
  return entries.map((entry) => entry.slug)
}

export function getFeaturedAfter(count = 4): AfterEntry[] {
  return entries.filter((entry) => entry.featured).slice(0, count)
}

export function getRelatedAfter(entry: AfterEntry, count = 2): AfterEntry[] {
  const sameKind = entries.filter((e) => e.kind === entry.kind && e.slug !== entry.slug)
  const sameTopic = entries.filter(
    (e) => e.topic === entry.topic && e.kind !== entry.kind && e.slug !== entry.slug,
  )
  const rest = entries.filter((e) => e.kind !== entry.kind && e.topic !== entry.topic)
  return [...sameKind, ...sameTopic, ...rest].slice(0, count)
}

export function searchAfter(query: string): AfterEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return entries
  return entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(q) ||
      entry.summary.toLowerCase().includes(q) ||
      entry.detail.toLowerCase().includes(q) ||
      entry.org.toLowerCase().includes(q) ||
      entry.topic.toLowerCase().includes(q) ||
      entry.source.label.toLowerCase().includes(q),
  )
}

/** Sort key that keeps year-only and month-only dates comparable. */
export function afterSortKey(date: string | undefined): number {
  if (!date) return 0
  const [year, month, day] = date.split('-')
  return Number(year) * 10000 + Number(month ?? 1) * 100 + Number(day ?? 1)
}

/** Newest first. Undated entries (researchers) sort last. */
export function sortAfterByDate(list: AfterEntry[] = entries): AfterEntry[] {
  return [...list].sort((a, b) => afterSortKey(b.date) - afterSortKey(a.date))
}

export interface AfterQuery {
  kind?: Kind | null
  topic?: Topic | null
  q?: string
}

export function queryAfter({ kind = null, topic = null, q = '' }: AfterQuery): AfterEntry[] {
  const needle = q.trim().toLowerCase()
  return entries.filter((entry) => {
    if (kind && entry.kind !== kind) return false
    if (topic && entry.topic !== topic) return false
    if (!needle) return true
    return (
      entry.title.toLowerCase().includes(needle) ||
      entry.summary.toLowerCase().includes(needle) ||
      entry.detail.toLowerCase().includes(needle) ||
      entry.org.toLowerCase().includes(needle) ||
      entry.topic.toLowerCase().includes(needle) ||
      KIND_META[entry.kind].label.toLowerCase().includes(needle)
    )
  })
}
