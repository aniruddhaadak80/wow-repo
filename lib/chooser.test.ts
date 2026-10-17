import { describe, expect, it } from 'vitest'
import { KIND_META, entries } from '@/content/registry'
import { getChooserCatalog, getChooserOptions } from './chooser-catalog'
import {
  CHOOSER_GOALS,
  buildSetupScript,
  buildStackMarkdown,
  getGoal,
  recommendStack,
  type ChooserAnswers,
} from './chooser'

/*
 * The chooser makes a promise: explainable, deterministic, and never padded
 * with entries that do not fit. These tests hold it to that, and to the one
 * structural rule that keeps the client bundle small: the island scores from a
 * slim catalog, not the whole registry.
 */
const CATALOG = getChooserCatalog()

describe('stack chooser', () => {
  it('offers every goal with a label and a blurb', () => {
    expect(CHOOSER_GOALS.length).toBeGreaterThanOrEqual(4)
    for (const goal of CHOOSER_GOALS) {
      expect(goal.label.length).toBeGreaterThan(0)
      expect(goal.blurb.length).toBeGreaterThan(0)
      expect(goal.crafts.length).toBeGreaterThan(0)
      expect(goal.kinds.length).toBeGreaterThan(0)
    }
  })

  it('falls back to a real goal for an unknown id', () => {
    expect(getGoal('ship-ui').id).toBe('ship-ui')
    expect(getGoal('nonsense' as never).id).toBe(CHOOSER_GOALS[0].id)
  })

  it('is deterministic: the same answers give the same order', () => {
    const answers = { goal: 'connect-data' as const }
    const first = recommendStack(answers, 5, CATALOG).map((row) => row.entry.slug)
    const second = recommendStack(answers, 5, CATALOG).map((row) => row.entry.slug)
    expect(first).toEqual(second)
  })

  it('never returns more than asked and never a non-positive score', () => {
    const rows = recommendStack({ goal: 'automate' }, 3, CATALOG)
    expect(rows.length).toBeLessThanOrEqual(3)
    expect(rows.every((row) => row.score > 0)).toBe(true)
  })

  it('always explains why an entry surfaced', () => {
    for (const row of recommendStack({ goal: 'ship-ui' }, 5, CATALOG)) {
      expect(row.reasons.length).toBeGreaterThan(0)
    }
  })

  it('honours an explicit craft filter', () => {
    const rows = recommendStack({ goal: 'research', craft: 'Multimedia' }, 5, CATALOG)
    expect(rows.every((row) => row.entry.craft === 'Multimedia')).toBe(true)
  })

  it('pushes unlicensed entries down when the reader wants open source', () => {
    const rows = recommendStack({ goal: 'self-host', licence: 'open' }, 20, CATALOG)
    const licensed = rows.filter((row) => row.entry.license)
    const unlicensed = rows.filter((row) => !row.entry.license)
    if (licensed.length > 0 && unlicensed.length > 0) {
      expect(Math.min(...licensed.map((row) => row.score))).toBeGreaterThanOrEqual(
        Math.max(...unlicensed.map((row) => row.score)),
      )
    }
  })

  it('builds a script that runs every recommended command', () => {
    const rows = recommendStack({ goal: 'automate' }, 4, CATALOG)
    const script = buildSetupScript(rows)
    expect(script.startsWith('#!/usr/bin/env bash')).toBe(true)
    for (const row of rows) {
      expect(script).toContain(row.entry.command)
    }
  })

  it('builds markdown with one bullet per entry', () => {
    const rows = recommendStack({ goal: 'ship-ui' }, 3, CATALOG)
    const md = buildStackMarkdown(rows)
    expect(md.split('\n')).toHaveLength(rows.length)
    expect(md).toContain(rows[0].entry.name)
  })

  it('only offers crafts and kinds that exist in the catalog', () => {
    const options = getChooserOptions()
    const knownCrafts = new Set(entries.map((entry) => entry.craft))
    const knownKinds = new Set(entries.map((entry) => entry.kind))
    expect(options.crafts.every((craft) => knownCrafts.has(craft))).toBe(true)
    expect(options.kinds.every((kind) => knownKinds.has(kind))).toBe(true)
  })

  it('hands the client a slim catalog: no description, no triggers, but a kind label', () => {
    expect(CATALOG).toHaveLength(entries.length)
    for (const row of CATALOG) {
      expect('description' in row).toBe(false)
      expect('triggers' in row).toBe(false)
      expect(row.kindLabel).toBe(KIND_META[row.kind].label)
    }
  })

  it('scores the same whichever catalog row shape it is given', () => {
    const answers: ChooserAnswers = { goal: 'multimedia' }
    const fromSlim = recommendStack(answers, 5, CATALOG).map((row) => row.entry.slug)
    const again = recommendStack(answers, 5, getChooserCatalog()).map((row) => row.entry.slug)
    expect(fromSlim).toEqual(again)
  })
})
