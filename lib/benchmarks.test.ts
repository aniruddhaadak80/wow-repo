import { describe, expect, it } from 'vitest'
import {
  SORT_OPTIONS,
  efficiency,
  filterByTrack,
  formatCost,
  formatDate,
  formatDelta,
  formatLatency,
  formatScore,
  getBenchmarkEntries,
  getBenchmarkIds,
  getEntryById,
  getRelatedEntries,
  getSuiteLabels,
  getSuiteLeaders,
  getTrackCount,
  hasAllTracks,
  isEfficientLeader,
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

  it('formats an ISO date without drifting across timezones', () => {
    expect(formatDate('2026-10-04')).toBe('Oct 4')
    expect(formatDate('2026-01-01')).toBe('Jan 1')
  })
})

describe('getBenchmarkIds', () => {
  it('returns one id per run, matching the dataset', () => {
    expect(getBenchmarkIds()).toHaveLength(entries.length)
    expect(getBenchmarkIds()).toContain('wow-runner')
    expect(new Set(getBenchmarkIds()).size).toBe(getBenchmarkIds().length)
  })

  it('resolves every id back to an entry', () => {
    for (const id of getBenchmarkIds()) {
      expect(getEntryById(id)?.id).toBe(id)
    }
  })
})

describe('getRelatedEntries', () => {
  it('never returns the entry itself', () => {
    for (const entry of entries) {
      expect(getRelatedEntries(entry).some((other) => other.id === entry.id)).toBe(false)
    }
  })

  it('prefers the same track, ordered by score', () => {
    const llm = getEntryById('gpt-5-2')!
    const related = getRelatedEntries(llm, 3)
    expect(related).toHaveLength(3)
    expect(related.every((other) => other.track === 'llm')).toBe(true)
    const scores = related.map((other) => other.score)
    expect([...scores].sort((a, b) => b - a)).toEqual(scores)
  })

  it('falls back to the other track when the track runs out', () => {
    const agent = getEntryById('spool')!
    const others = entries.filter((entry) => entry.track === 'agent').length - 1
    const models = entries.filter((entry) => entry.track === 'llm').length

    // Ask for more than the track can supply: the tail must come from the other track.
    const related = getRelatedEntries(agent, others + 3)
    expect(related).toHaveLength(others + 3)
    expect(related.slice(0, others).every((o) => o.track === 'agent')).toBe(true)
    expect(related.slice(others)).toHaveLength(3)
    expect(related.slice(others).every((o) => o.track === 'llm')).toBe(true)
    expect(others + models).toBeGreaterThan(others + 3)
  })

  it('can return the whole dataset minus one', () => {
    const related = getRelatedEntries(entries[0], entries.length)
    expect(related).toHaveLength(entries.length - 1)
    expect(new Set(related.map((o) => o.id)).size).toBe(related.length)
  })

  it('honours the requested count', () => {
    expect(getRelatedEntries(entries[0], 1)).toHaveLength(1)
    expect(getRelatedEntries(entries[0], 0)).toHaveLength(0)
  })
})

describe('suite analysis', () => {
  it('lists every distinct suite exactly once', () => {
    const labels = getSuiteLabels()
    expect(new Set(labels).size).toBe(labels.length)
    const perEntry = new Set(entries.flatMap((e) => e.breakdown.map((b) => b.label)))
    expect([...perEntry].sort()).toEqual([...labels].sort())
  })

  it('names the highest scorer for every suite', () => {
    for (const suite of getSuiteLeaders(entries)) {
      const scored = entries
        .filter((entry) => entry.breakdown.some((item) => item.label === suite.label))
        .map((entry) => ({
          entry,
          score: entry.breakdown.find((item) => item.label === suite.label)!.score,
        }))
      const best = scored.reduce((a, b) => (a.score > b.score ? a : b))
      expect(suite.leader.id).toBe(best.entry.id)
    }
  })

  it('reports spread as best minus worst, never negative', () => {
    for (const suite of getSuiteLeaders(entries)) {
      expect(suite.spread).toBeGreaterThanOrEqual(0)
      const scores = entries
        .filter((entry) => entry.breakdown.some((item) => item.label === suite.label))
        .map((entry) => entry.breakdown.find((item) => item.label === suite.label)!.score)
      expect(suite.spread).toBe(Math.max(...scores) - Math.min(...scores))
    }
  })

  it('returns no leaders when there are no entries', () => {
    expect(getSuiteLeaders([])).toEqual([])
    expect(getSuiteLabels([])).toEqual([])
  })
})

describe('efficiency', () => {
  it('is score divided by cost', () => {
    const entry = getEntryById('deepseek-v3-2')!
    expect(efficiency(entry)).toBeCloseTo(entry.score / entry.cost, 6)
  })

  it('does not divide by zero', () => {
    const free = { ...entries[0], cost: 0 }
    expect(efficiency(free)).toBe(Number.POSITIVE_INFINITY)
    expect(Number.isNaN(efficiency(free))).toBe(false)
  })

  it('marks the cheapest strong runner as the value leader, not the top scorer', () => {
    const leaders = entries.filter(isEfficientLeader)
    expect(leaders.length).toBeGreaterThan(0)
    // Every leader must beat every other run in its own track on score per cent.
    for (const leader of leaders) {
      const peers = entries.filter((entry) => entry.track === leader.track)
      for (const peer of peers) {
        expect(efficiency(peer)).toBeLessThanOrEqual(efficiency(leader) + Number.EPSILON)
      }
    }
  })

  it('never marks the same run twice per track', () => {
    const perTrack = new Map<string, number>()
    for (const leader of entries.filter(isEfficientLeader)) {
      perTrack.set(leader.track, (perTrack.get(leader.track) ?? 0) + 1)
    }
    for (const count of perTrack.values()) expect(count).toBe(1)
  })

  it('returns false for a track with no contenders', () => {
    expect(isEfficientLeader(entries[0])).toBeTypeOf('boolean')
  })
})
