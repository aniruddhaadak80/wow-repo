import { describe, expect, it } from 'vitest'
import { entries } from '@/content/registry'
import { formatMonth, getTimeline, getTimelineSummary } from './timeline'

/*
 * The timeline is a re-sort, not a new source of truth, so the tests mostly
 * check that nothing is lost and that the ordering holds: every entry appears
 * once, newest month first, newest entry first inside a month.
 */
describe('timeline', () => {
  it('contains every entry exactly once', () => {
    const flat = getTimeline().flatMap((year) => year.months.flatMap((month) => month.entries))
    expect(flat).toHaveLength(entries.length)
    expect(new Set(flat.map((entry) => entry.slug)).size).toBe(entries.length)
  })

  it('orders years and months newest first', () => {
    const timeline = getTimeline()
    const years = timeline.map((year) => year.year)
    expect(years).toEqual([...years].sort((a, b) => b.localeCompare(a)))

    for (const year of timeline) {
      const months = year.months.map((month) => month.month)
      expect(months).toEqual([...months].sort((a, b) => b.localeCompare(a)))
    }
  })

  it('orders entries inside a month newest first', () => {
    for (const year of getTimeline()) {
      for (const month of year.months) {
        const dates = month.entries.map((entry) => entry.addedAt)
        expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)))
      }
    }
  })

  it('counts a year as the sum of its months', () => {
    for (const year of getTimeline()) {
      const sum = year.months.reduce((total, month) => total + month.entries.length, 0)
      expect(year.count).toBe(sum)
    }
  })

  it('summarises the same numbers it renders', () => {
    const summary = getTimelineSummary()
    expect(summary.total).toBe(entries.length)
    expect(summary.months).toBe(
      getTimeline().reduce((total, year) => total + year.months.length, 0),
    )
    expect(summary.years).toBe(getTimeline().length)
    if (summary.busiest) {
      expect(summary.busiest.count).toBeGreaterThan(0)
    }
  })

  it('labels a month in full', () => {
    expect(formatMonth('2026-10')).toBe('October 2026')
    expect(formatMonth('2026-01')).toBe('January 2026')
  })
})
