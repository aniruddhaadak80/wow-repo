import { describe, expect, it } from 'vitest'
import { CRAFTS, KINDS, entries } from '@/content/registry'
import {
  countTriggers,
  getCraftView,
  getCraftViews,
  getKindView,
  getKindViews,
  getRelatedCrafts,
  getRelatedKinds,
} from './taxonomy'

/*
 * The taxonomy pages are only as honest as these functions. The point of the
 * tests is that every number traces back to the catalog: no view may claim an
 * entry that is not really in that craft or kind.
 */
describe('taxonomy views', () => {
  it('accounts for every entry exactly once per craft', () => {
    const total = getCraftViews().reduce((sum, view) => sum + view.count, 0)
    expect(total).toBe(entries.length)
  })

  it('accounts for every entry exactly once per kind', () => {
    const total = getKindViews().reduce((sum, view) => sum + view.count, 0)
    expect(total).toBe(entries.length)
  })

  it('returns one view per craft and per kind', () => {
    expect(getCraftViews()).toHaveLength(CRAFTS.length)
    expect(getKindViews()).toHaveLength(KINDS.length)
  })

  it('only lists entries that belong to the craft', () => {
    for (const craft of CRAFTS) {
      const view = getCraftView(craft)
      expect(view.entries.every((entry) => entry.craft === craft)).toBe(true)
      expect(view.count).toBe(view.entries.length)
    }
  })

  it('only lists entries that belong to the kind, with the label attached', () => {
    for (const kind of KINDS) {
      const view = getKindView(kind)
      expect(view.entries.every((entry) => entry.kind === kind)).toBe(true)
      expect(view.count).toBe(view.entries.length)
      expect(view.label.length).toBeGreaterThan(0)
      expect(view.blurb.length).toBeGreaterThan(0)
    }
  })

  it('sorts views busiest first', () => {
    const counts = getCraftViews().map((view) => view.count)
    expect(counts).toEqual([...counts].sort((a, b) => b - a))
  })

  it('sorts the entries inside a view by name', () => {
    for (const craft of CRAFTS) {
      const names = getCraftView(craft).entries.map((entry) => entry.name)
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    }
  })

  it('reports the newest entry by catalog date', () => {
    const view = getCraftView('Design')
    if (view.newest) {
      expect(view.entries.some((entry) => entry.slug === view.newest?.slug)).toBe(true)
    }
  })

  it('counts triggers within a pool, never beyond it', () => {
    const pool = entries.filter((entry) => entry.craft === 'Design')
    const triggers = countTriggers(pool, 4)
    expect(triggers.length).toBeLessThanOrEqual(4)
    const owned = new Set(pool.flatMap((entry) => entry.triggers))
    expect(triggers.every((row) => owned.has(row.trigger))).toBe(true)
  })

  it('suggests related crafts and kinds that exclude the subject', () => {
    expect(getRelatedCrafts('Design')).not.toContain('Design')
    expect(getRelatedKinds('skill')).not.toContain('skill')
    expect(getRelatedCrafts('Design')).toHaveLength(2)
    expect(getRelatedKinds('skill')).toHaveLength(3)
  })
})
