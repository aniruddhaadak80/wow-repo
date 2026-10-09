import { describe, expect, it } from 'vitest'
import {
  afterSortKey,
  getAfterEntries,
  getAfterEntriesByKind,
  getAfterEntryBySlug,
  getFeaturedAfter,
  getRelatedAfter,
  queryAfter,
  searchAfter,
  sortAfterByDate,
} from './superintelligence'

/*
 * Behavioral guard for the After the world query layer. The content tests
 * keep the dataset honest; these keep the reads honest: lookups round-trip,
 * filters compose, and undated researchers always sort last.
 */
describe('superintelligence query layer', () => {
  it('round-trips a slug lookup', () => {
    const entry = getAfterEntryBySlug('ai-2027')
    expect(entry?.title).toContain('AI 2027')
    expect(getAfterEntryBySlug('no-such-entry')).toBeUndefined()
  })

  it('returns the whole collection on an empty search', () => {
    expect(searchAfter('')).toHaveLength(getAfterEntries().length)
    expect(searchAfter('   ')).toHaveLength(getAfterEntries().length)
  })

  it('searches case-insensitively across titles, voices, and sources', () => {
    expect(searchAfter('hinton').length).toBeGreaterThanOrEqual(3)
    expect(searchAfter('HINTON').map((e) => e.slug)).toEqual(
      searchAfter('hinton').map((e) => e.slug),
    )
    expect(searchAfter('arxiv').every((e) => e.kind === 'paper')).toBe(true)
  })

  it('composes kind, topic, and query filters', () => {
    const papers = queryAfter({ kind: 'paper' })
    expect(papers).toHaveLength(getAfterEntriesByKind('paper').length)
    expect(papers.every((e) => e.kind === 'paper')).toBe(true)

    const timedPapers = queryAfter({ kind: 'paper', topic: 'Timelines' })
    expect(timedPapers.length).toBeGreaterThan(0)
    expect(timedPapers.every((e) => e.kind === 'paper' && e.topic === 'Timelines')).toBe(true)

    const hinton = queryAfter({ q: 'hinton' })
    expect(queryAfter({ kind: 'quote', q: 'hinton' }).length).toBeLessThanOrEqual(hinton.length)
  })

  it('returns only flagged entries from the featured read', () => {
    const featured = getFeaturedAfter()
    expect(featured.length).toBeGreaterThan(0)
    expect(featured.every((e) => e.featured)).toBe(true)
  })

  it('relates same-kind entries before anything else, and never self', () => {
    const entry = getAfterEntryBySlug('ai-2027')
    expect(entry).toBeDefined()
    if (!entry) return
    const related = getRelatedAfter(entry, 3)
    expect(related).toHaveLength(3)
    expect(related.map((e) => e.slug)).not.toContain(entry.slug)
    expect(related[0].kind).toBe(entry.kind)
  })

  it('sorts newest first and undated researchers last', () => {
    const sorted = sortAfterByDate()
    expect(sorted[0].date).toBeDefined()
    const firstUndated = sorted.findIndex((e) => e.date === undefined)
    expect(firstUndated).toBeGreaterThan(0)
    expect(sorted.slice(firstUndated).every((e) => e.date === undefined)).toBe(true)
    expect(afterSortKey(undefined)).toBe(0)
    expect(afterSortKey('2025-04-03')).toBeGreaterThan(afterSortKey('2025-04'))
    expect(afterSortKey('2025-04')).toBeGreaterThan(afterSortKey('2025'))
  })
})
