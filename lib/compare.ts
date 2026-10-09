import type { RegistryEntry } from '@/content/registry'
import { formatEntryDate } from '@/lib/registry'

/**
 * Side-by-side comparison of registry entries.
 *
 * The board compares real fields, so every row is either a shared trait or a
 * real difference. Nothing is scored or ranked: a registry entry has no
 * comparable metric that is not invented, and this repo does not invent
 * numbers.
 */

export type CompareRowKind = 'shared' | 'different' | 'empty'

export interface CompareRow {
  label: string
  values: Array<string | null>
  kind: CompareRowKind
}

export const COMPARE_LIMIT = 4

export function resolveCompareSlugs(slugs: string[], catalog: RegistryEntry[]): string[] {
  const known = new Set(catalog.map((entry) => entry.slug))
  const unique: string[] = []
  for (const slug of slugs) {
    if (known.has(slug) && !unique.includes(slug)) unique.push(slug)
    if (unique.length >= COMPARE_LIMIT) break
  }
  return unique
}

export function getCompareEntries(slugs: string[], catalog: RegistryEntry[]): RegistryEntry[] {
  return resolveCompareSlugs(slugs, catalog)
    .map((slug) => catalog.find((entry) => entry.slug === slug))
    .filter((entry): entry is RegistryEntry => Boolean(entry))
}

function classify(values: Array<string | null>): CompareRowKind {
  const present = values.filter((value): value is string => Boolean(value))
  if (present.length === 0) return 'empty'
  return new Set(present).size === 1 ? 'shared' : 'different'
}

/** Triggers two entries share, which is the only real overlap signal here. */
export function sharedTriggers(entries: RegistryEntry[]): string[] {
  if (entries.length < 2) return []
  return entries[0].triggers.filter((trigger) =>
    entries.every((entry) => entry.triggers.includes(trigger)),
  )
}

export function buildCompareRows(entries: RegistryEntry[]): CompareRow[] {
  const pick = (read: (entry: RegistryEntry) => string | null) =>
    entries.map((entry) => read(entry))

  const rows: CompareRow[] = [
    {
      label: 'Kind',
      values: pick((entry) => entry.kind),
      kind: 'shared',
    },
    {
      label: 'Craft',
      values: pick((entry) => entry.craft),
      kind: 'shared',
    },
  ]

  const build = (label: string, read: (entry: RegistryEntry) => string | null): CompareRow => {
    const values = pick(read)
    return { label, values, kind: classify(values) }
  }

  rows.push(
    build('Command', (entry) => entry.command),
    build('What it is', (entry) => entry.commandLabel),
    build('Licence', (entry) => entry.license ?? null),
    build('Source', (entry) => entry.url),
    build('Added', (entry) => formatEntryDate(entry.addedAt)),
  )

  return rows.map((row) => ({ ...row, kind: classify(row.values) }))
}

/** Registry entries that can still be added without exceeding the limit. */
export function remainingCandidates(
  selected: string[],
  catalog: RegistryEntry[],
  query = '',
): RegistryEntry[] {
  const needle = query.trim().toLowerCase()
  return catalog
    .filter((entry) => !selected.includes(entry.slug))
    .filter((entry) => {
      if (!needle) return true
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.tagline.toLowerCase().includes(needle) ||
        entry.triggers.some((trigger) => trigger.toLowerCase().includes(needle))
      )
    })
    .slice(0, 40)
}
