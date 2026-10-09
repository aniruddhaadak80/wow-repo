import { describe, expect, it } from 'vitest'
import { getEntries } from './registry'
import {
  COMPARE_LIMIT,
  buildCompareRows,
  getCompareEntries,
  remainingCandidates,
  resolveCompareSlugs,
  sharedTriggers,
} from './compare'

const catalog = getEntries()

describe('compare', () => {
  it('resolves only known slugs, drops duplicates, and caps the selection', () => {
    const [first, second, third] = catalog
    const slugs = [first.slug, 'not-a-real-slug', first.slug, second.slug, third.slug]
    expect(resolveCompareSlugs(slugs, catalog)).toEqual([first.slug, second.slug, third.slug])

    const tooMany = catalog.slice(0, COMPARE_LIMIT + 3).map((entry) => entry.slug)
    expect(resolveCompareSlugs(tooMany, catalog)).toHaveLength(COMPARE_LIMIT)
  })

  it('returns the entries themselves in the order asked for', () => {
    const entries = getCompareEntries([catalog[3].slug, catalog[1].slug], catalog)
    expect(entries.map((entry) => entry.slug)).toEqual([catalog[3].slug, catalog[1].slug])
  })

  it('builds one row per compared field and classifies them', () => {
    const entries = getCompareEntries([catalog[0].slug, catalog[1].slug], catalog)
    const rows = buildCompareRows(entries)

    const labels = rows.map((row) => row.label)
    expect(labels).toContain('Command')
    expect(labels).toContain('Added')
    expect(rows.every((row) => row.values.length === entries.length)).toBe(true)
    expect(rows.every((row) => ['shared', 'different', 'empty'].includes(row.kind))).toBe(true)

    // Two different entries cannot share a command row.
    const commandRow = rows.find((row) => row.label === 'Command')
    expect(commandRow?.kind).toBe('different')
  })

  it('marks a row shared when the values match', () => {
    const twoOfAKind = catalog.filter((entry) => entry.kind === catalog[0].kind).slice(0, 2)
    const rows = buildCompareRows(twoOfAKind)
    expect(rows.find((row) => row.label === 'Kind')?.kind).toBe('shared')
    expect(rows.find((row) => row.label === 'Licence')?.kind).not.toBe('different')
  })

  it('reports no shared triggers for a single entry or no overlap', () => {
    expect(sharedTriggers([catalog[0]])).toEqual([])
    expect(sharedTriggers([catalog[0], catalog[1]])).toEqual([])
  })

  it('excludes the already selected entries from the candidate list', () => {
    const selected = [catalog[0].slug]
    const candidates = remainingCandidates(selected, catalog)
    expect(candidates.some((entry) => entry.slug === catalog[0].slug)).toBe(false)
    expect(candidates.length).toBeGreaterThan(0)
  })

  it('filters candidates by the query across every searchable field', () => {
    const needle = catalog[0].name.slice(0, 6)
    const candidates = remainingCandidates([], catalog, needle)
    const matches = (haystack: string) => haystack.toLowerCase().includes(needle.toLowerCase())

    // Every candidate must be findable somewhere, not only by name.
    for (const entry of candidates) {
      const findable =
        matches(entry.name) ||
        matches(entry.tagline) ||
        entry.triggers.some((trigger) => matches(trigger))
      expect(findable, entry.slug).toBe(true)
    }
    // And the entry whose name was trimmed must be among them.
    expect(candidates.some((entry) => entry.slug === catalog[0].slug)).toBe(true)
  })
})
