import { describe, expect, it } from 'vitest'
import {
  SORT_OPTIONS,
  filterByTrack,
  formatCost,
  formatDelta,
  formatLatency,
  formatScore,
  getBenchmarkEntries,
  getEntryById,
  getTrackCount,
  hasAllTracks,
  rankEntries,
  searchEntries,
  sortEntries,
  summarize,
  type BenchmarkEntry,
} from './benchmarks'

const entries = getBenchmarkEntries()

describe('benchmark dataset', () => {
  it('exposes both tracks with entries', () => {
    expect(hasAllTracks()).toBe(true)
    expect(getTrackCount('llm')).toBeGreaterThan(0)
    expect(getTrackCount('agent')).toBeGreaterThan(0)
  })

  it('looks entries up by id', () => {
    expect(getEntryById('wow-runner')?.name).toBe('wow-runner')
    expect(getEntryById('does-not-exist')).toBeUndefined()
  })
})

describe('filterByTrack', () => {
  it('returns everything for "all"', () => {
    expect(filterByTrack(entries, 'all')).toHaveLength(entries.length)
  })

  it('narrows to a single track', () => {
    const llm = filterByTrack(entries, 'llm')
    expect(llm.every((entry) => entry.track === 'llm')).toBe(true)
    expect(llm.length).toBeLessThan(entries.length)
  })
})

describe('searchEntries', () => {
  it('returns everything for an empty query', () => {
    expect(searchEntries(entries, '   ')).toHaveLength(entries.length)
  })

  it('matches on model name, case-insensitively', () => {
    const results = searchEntries(entries, 'CLAUDE')
    expect(results.map((entry) => entry.id)).toContain('claude-sonnet-4-5')
  })

  it('matches on lab name', () => {
    const results = searchEntries(entries, 'anthropic')
    expect(results).toHaveLength(1)
  })

  it('matches on a breakdown suite name', () => {
    const results = searchEntries(entries, 'swe-bench')
    expect(results.length).toBe(getTrackCount('llm'))
  })

  it('returns nothing for nonsense', () => {
    expect(searchEntries(entries, 'zzzz-not-a-thing')).toHaveLength(0)
  })
})

describe('sortEntries', () => {
  it('sorts by score descending', () => {
    const sorted = sortEntries(entries, 'score')
    const scores = sorted.map((entry) => entry.score)
    expect([...scores].sort((a, b) => b - a)).toEqual(scores)
  })

  it('sorts latency and cost ascending because lower is better', () => {
    expect(sortEntries(entries, 'latency')[0].latency).toBe(
      Math.min(...entries.map((entry) => entry.latency)),
    )
    expect(sortEntries(entries, 'cost')[0].cost).toBe(
      Math.min(...entries.map((entry) => entry.cost)),
    )
  })

  it('sorts by change descending', () => {
    const deltas = sortEntries(entries, 'delta').map((entry) => entry.delta)
    expect([...deltas].sort((a, b) => b - a)).toEqual(deltas)
  })

  it('sorts by name alphabetically', () => {
    const names = sortEntries(entries, 'name').map((entry) => entry.name)
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names)
  })

  it('does not mutate the input array', () => {
    const original = [...entries]
    sortEntries(entries, 'name')
    expect(entries).toEqual(original)
  })

  it('exposes one sort option per sortable key', () => {
    expect(SORT_OPTIONS.map((option) => option.key)).toEqual([
      'score',
      'delta',
      'latency',
      'cost',
      'name',
    ])
  })
})

describe('rankEntries', () => {
  it('ranks by score even when the rows are sorted by something else', () => {
    const byLatency = sortEntries(entries, 'latency')
    const ranked = rankEntries(byLatency)
    const top = ranked.reduce((best, entry) => (entry.score > best.score ? entry : best))
    expect(ranked.find((entry) => entry.id === top.id)?.rank).toBe(1)
  })

  it('keeps the incoming row order', () => {
    const byName = sortEntries(entries, 'name')
    expect(rankEntries(byName).map((entry) => entry.name)).toEqual(byName.map((e) => e.name))
  })

  it('gives tied scores the same rank and skips the next one', () => {
    const tied: BenchmarkEntry[] = [
      { ...entries[0], id: 'a', score: 90 },
      { ...entries[1], id: 'b', score: 80 },
      { ...entries[2], id: 'c', score: 80 },
      { ...entries[3], id: 'd', score: 70 },
    ]
    const ranks = rankEntries(tied).map((entry) => entry.rank)
    expect(ranks).toEqual([1, 2, 2, 4])
  })

  it('handles an empty list', () => {
    expect(rankEntries([])).toEqual([])
  })
})

describe('summarize', () => {
  it('reports the run count, best score, and leader', () => {
    const stats = summarize(entries)
    expect(stats.runs).toBe(entries.length)
    expect(stats.best).toBe(Math.max(...entries.map((entry) => entry.score)))
    expect(stats.leader).toBe('wow-runner')
  })

  it('summarises a single track when filtered', () => {
    const stats = summarize(filterByTrack(entries, 'llm'))
    expect(stats.runs).toBe(getTrackCount('llm'))
    expect(stats.leader).toBe('Claude Sonnet 4.5')
    expect(stats.leader).not.toBe(summarize(filterByTrack(entries, 'agent')).leader)
  })

  it('takes the middle value for an odd count', () => {
    const stats = summarize([...entries.slice(0, 3)])
    const scores = entries
      .slice(0, 3)
      .map((entry) => entry.score)
      .sort((a, b) => a - b)
    expect(stats.median).toBe(scores[1])
  })

  it('averages the middle pair for an even count', () => {
    const stats = summarize([...entries.slice(0, 4)])
    const scores = entries
      .slice(0, 4)
      .map((entry) => entry.score)
      .sort((a, b) => a - b)
    expect(stats.median).toBe((scores[1] + scores[2]) / 2)
  })

  it('returns zeroes for an empty selection', () => {
    expect(summarize([])).toEqual({ runs: 0, best: 0, median: 0, leader: '-' })
  })
})

describe('formatters', () => {
  it('formats scores to one decimal', () => {
    expect(formatScore(76.34)).toBe('76.3')
    expect(formatScore(100)).toBe('100.0')
  })

  it('signs deltas and renders zero without a sign', () => {
    expect(formatDelta(2.14)).toBe('+2.1')
    expect(formatDelta(-0.83)).toBe('-0.8')
    expect(formatDelta(0)).toBe('0.0')
  })

  it('formats latency and cost', () => {
    expect(formatLatency(38.44)).toBe('38.4s')
    expect(formatCost(0.4)).toBe('$0.40')
  })
})
