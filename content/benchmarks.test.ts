import { describe, expect, it } from 'vitest'
import { benchmarkEntries, BENCHMARK_TRACKS } from './benchmarks'

/*
 * Data integrity guard. The demo dataset is hand-edited, so these tests keep
 * it honest: unique ids, valid tracks, scores in range, every run explained by
 * a breakdown. If someone drops a row in, this fails loudly.
 */
describe('benchmark dataset integrity', () => {
  it('has a non-trivial number of runs', () => {
    expect(benchmarkEntries.length).toBeGreaterThanOrEqual(10)
  })

  it('uses unique ids', () => {
    const ids = benchmarkEntries.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses unique names within a track', () => {
    for (const track of BENCHMARK_TRACKS) {
      const names = benchmarkEntries.filter((e) => e.track === track).map((e) => e.name)
      expect(new Set(names).size, `duplicate name in ${track}`).toBe(names.length)
    }
  })

  it('only uses declared tracks', () => {
    for (const entry of benchmarkEntries) {
      expect(BENCHMARK_TRACKS).toContain(entry.track)
    }
  })

  it('keeps every score inside 0-100', () => {
    for (const entry of benchmarkEntries) {
      expect(entry.score, entry.id).toBeGreaterThanOrEqual(0)
      expect(entry.score, entry.id).toBeLessThanOrEqual(100)
      for (const item of entry.breakdown) {
        expect(item.score, `${entry.id} / ${item.label}`).toBeGreaterThanOrEqual(0)
        expect(item.score, `${entry.id} / ${item.label}`).toBeLessThanOrEqual(100)
      }
    }
  })

  it('gives every run a breakdown and a positive latency and cost', () => {
    for (const entry of benchmarkEntries) {
      expect(entry.breakdown.length, entry.id).toBeGreaterThan(0)
      expect(entry.latency, entry.id).toBeGreaterThan(0)
      expect(entry.cost, entry.id).toBeGreaterThan(0)
      expect(entry.org.length, entry.id).toBeGreaterThan(0)
      expect(entry.updatedAt, entry.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('keeps the composite score near the mean of its breakdown', () => {
    for (const entry of benchmarkEntries) {
      const mean =
        entry.breakdown.reduce((sum, item) => sum + item.score, 0) / entry.breakdown.length
      expect(
        Math.abs(mean - entry.score),
        `${entry.id} composite is far from its breakdown`,
      ).toBeLessThan(25)
    }
  })
})
