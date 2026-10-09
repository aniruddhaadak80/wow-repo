import {
  CRAFTS,
  KIND_META,
  KINDS,
  entries,
  type Craft,
  type Kind,
  type RegistryEntry,
} from '@/content/registry'

export { CRAFTS, KIND_META, KINDS, entries }
export type { Craft, Kind, RegistryEntry }

export function getEntries(): RegistryEntry[] {
  return entries
}

/** Skills only: the subset the /skills routes render. */
export function getSkillEntries(): RegistryEntry[] {
  return getEntriesByKind('skill')
}

export function getSkillSlugs(): string[] {
  return getSkillEntries().map((entry) => entry.slug)
}

export function getEntryBySlug(slug: string): RegistryEntry | undefined {
  return entries.find((entry) => entry.slug === slug)
}

export function getEntriesByKind(kind: Kind): RegistryEntry[] {
  return entries.filter((entry) => entry.kind === kind)
}

export function getEntriesByCraft(craft: Craft): RegistryEntry[] {
  return entries.filter((entry) => entry.craft === craft)
}

export function getEntrySlugs(): string[] {
  return entries.map((entry) => entry.slug)
}

export interface RegistryCounts {
  total: number
  kinds: number
  crafts: number
  byKind: Record<Kind, number>
  byCraft: Record<Craft, number>
}

export function getRegistryCounts(): RegistryCounts {
  const byKind = Object.fromEntries(KINDS.map((kind) => [kind, 0])) as Record<Kind, number>
  const byCraft = Object.fromEntries(CRAFTS.map((craft) => [craft, 0])) as Record<Craft, number>

  for (const entry of entries) {
    byKind[entry.kind] += 1
    byCraft[entry.craft] += 1
  }

  return {
    total: entries.length,
    kinds: KINDS.length,
    crafts: CRAFTS.length,
    byKind,
    byCraft,
  }
}

export function getRelatedEntries(entry: RegistryEntry, count = 3): RegistryEntry[] {
  const sameCraft = entries.filter((e) => e.craft === entry.craft && e.slug !== entry.slug)
  const sameKind = entries.filter(
    (e) => e.kind === entry.kind && e.craft !== entry.craft && e.slug !== entry.slug,
  )
  const rest = entries.filter((e) => e.kind !== entry.kind && e.craft !== entry.craft)
  return [...sameCraft, ...sameKind, ...rest].slice(0, count)
}

export interface RegistryQuery {
  kind?: Kind | null
  craft?: Craft | null
  q?: string
}

export function queryEntries({
  kind = null,
  craft = null,
  q = '',
}: RegistryQuery): RegistryEntry[] {
  const needle = q.trim().toLowerCase()
  return entries.filter((entry) => {
    if (kind && entry.kind !== kind) return false
    if (craft && entry.craft !== craft) return false
    if (!needle) return true
    return (
      entry.name.toLowerCase().includes(needle) ||
      entry.tagline.toLowerCase().includes(needle) ||
      entry.description.toLowerCase().includes(needle) ||
      entry.craft.toLowerCase().includes(needle) ||
      KIND_META[entry.kind].label.toLowerCase().includes(needle) ||
      entry.triggers.some((trigger) => trigger.toLowerCase().includes(needle))
    )
  })
}

export function formatEntryDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatShortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
