import { describe, expect, it } from 'vitest'
import { CRAFTS, KINDS, entries } from '@/content/registry'
import {
  getAddedTimeline,
  getCraftKindMatrix,
  getCraftStats,
  getKindStats,
  getLicenseStats,
  getNewestEntries,
  getRegistrySummary,
  getTopTriggers,
} from './stats'

describe('registry stats', () => {
  it('counts every entry exactly once per dimension', () => {
    const kindTotal = getKindStats().reduce((sum, row) => sum + row.count, 0)
    const craftTotal = getCraftStats().reduce((sum, row) => sum + row.count, 0)
    const licenseTotal = getLicenseStats().reduce((sum, row) => sum + row.count, 0)

    expect(kindTotal).toBe(entries.length)
    expect(craftTotal).toBe(entries.length)
    expect(licenseTotal).toBe(entries.length)
  })

  it('returns one stats row per declared kind and craft', () => {
    expect(getKindStats()).toHaveLength(KINDS.length)
    expect(getCraftStats()).toHaveLength(CRAFTS.length)
  })

  it('keeps shares as real fractions of the total', () => {
    for (const row of [...getKindStats(), ...getCraftStats(), ...getLicenseStats()]) {
      expect(row.share).toBeGreaterThan(0)
      expect(row.share).toBeLessThanOrEqual(1)
    }
    const kindShare = getKindStats().reduce((sum, row) => sum + row.share, 0)
    expect(kindShare).toBeCloseTo(1, 6)
  })

  it('sorts both breakdowns from largest to smallest', () => {
    const kindCounts = getKindStats().map((row) => row.count)
    const craftCounts = getCraftStats().map((row) => row.count)
    expect(kindCounts).toEqual([...kindCounts].sort((a, b) => b - a))
    expect(craftCounts).toEqual([...craftCounts].sort((a, b) => b - a))
  })

  it('builds a contiguous monthly timeline that still sums to the catalog', () => {
    const timeline = getAddedTimeline()

    for (let i = 1; i < timeline.length; i += 1) {
      expect(timeline[i].month > timeline[i - 1].month).toBe(true)
    }
    expect(new Set(timeline.map((bucket) => bucket.month)).size).toBe(timeline.length)
    expect(timeline.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(entries.length)
    for (const bucket of timeline) {
      expect(bucket.label).toMatch(/^\w{3} \d{4}$/)
    }
  })

  it('agrees with itself in the craft by kind matrix', () => {
    const matrix = getCraftKindMatrix()
    expect(matrix).toHaveLength(CRAFTS.length)

    for (const row of matrix) {
      const perKind = KINDS.reduce((sum, kind) => sum + row.counts[kind], 0)
      expect(perKind, row.label).toBe(row.total)
    }
    expect(matrix.reduce((sum, row) => sum + row.total, 0)).toBe(entries.length)
  })

  it('names every entry in the license breakdown, licensed or not', () => {
    const stated = getLicenseStats().find((row) => row.license === 'see source')
    const unlicensed = entries.filter((entry) => !entry.license).length
    expect(stated?.count ?? 0).toBe(unlicensed)
  })

  it('orders newest entries by date, newest first', () => {
    const newest = getNewestEntries(5)
    expect(newest).toHaveLength(5)
    for (let i = 1; i < newest.length; i += 1) {
      expect(newest[i].addedAt <= newest[i - 1].addedAt).toBe(true)
    }
  })

  it('ranks triggers by how many entries they surface', () => {
    const top = getTopTriggers(8)
    expect(top.length).toBeGreaterThan(0)
    for (let i = 1; i < top.length; i += 1) {
      expect(top[i].count).toBeLessThanOrEqual(top[i - 1].count)
    }
  })

  it('derives a summary that matches the dataset', () => {
    const summary = getRegistrySummary()
    expect(summary.total).toBe(entries.length)
    expect(summary.skills).toBe(entries.filter((e) => e.kind === 'skill').length)
    expect(summary.featured).toBe(entries.filter((e) => e.featured).length)
    expect(summary.months).toBe(getAddedTimeline().length)
    expect(summary.busiestMonth?.count ?? 0).toBeGreaterThan(0)
  })
})
