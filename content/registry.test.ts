import { describe, expect, it } from 'vitest'
import { CRAFTS, KINDS, KIND_META, entries } from './registry'

/*
 * Data integrity guard for the registry.
 *
 * The registry is the spine of the whole site: every banner count, every
 * filter chip, every detail page, and both APIs read from it. These tests
 * keep it honest: unique slugs, only declared kinds and crafts, a label for
 * every kind, dates the formatter can parse, real https links, and no
 * em-dashes in anything a visitor can read.
 */
describe('registry dataset integrity', () => {
  it('is a real catalog, not a stub', () => {
    expect(entries.length).toBeGreaterThanOrEqual(80)
  })

  it('uses unique slugs', () => {
    const slugs = entries.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('only uses declared kinds and crafts', () => {
    for (const entry of entries) {
      expect(KINDS, entry.slug).toContain(entry.kind)
      expect(CRAFTS, entry.slug).toContain(entry.craft)
    }
  })

  it('labels every kind it ships', () => {
    for (const kind of KINDS) {
      expect(KIND_META[kind].label.length, kind).toBeGreaterThan(0)
      expect(KIND_META[kind].blurb.length, kind).toBeGreaterThan(20)
    }
  })

  it('covers every kind, so no layer of the stack is missing', () => {
    for (const kind of KINDS) {
      expect(
        entries.some((entry) => entry.kind === kind),
        `no entries of kind ${kind}`,
      ).toBe(true)
    }
  })

  it('covers every craft across the catalog', () => {
    for (const craft of CRAFTS) {
      expect(
        entries.some((entry) => entry.craft === craft),
        `no entries in craft ${craft}`,
      ).toBe(true)
    }
  })

  it('keeps every date at a precision the formatter supports', () => {
    for (const entry of entries) {
      expect(entry.addedAt, entry.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('ships every entry with a real https source', () => {
    for (const entry of entries) {
      expect(entry.url, entry.slug).toMatch(/^https:\/\/[^\s]+$/)
      expect(entry.urlLabel.length, entry.slug).toBeGreaterThan(0)
    }
  })

  it('gives every entry a command and says what that command is', () => {
    for (const entry of entries) {
      expect(entry.command.length, entry.slug).toBeGreaterThan(0)
      expect(entry.commandLabel.length, entry.slug).toBeGreaterThan(0)
    }
  })

  it('gives every entry at least one trigger to be found by', () => {
    for (const entry of entries) {
      expect(entry.triggers.length, entry.slug).toBeGreaterThan(0)
      for (const trigger of entry.triggers) {
        expect(trigger.trim().length, `${entry.slug} has an empty trigger`).toBeGreaterThan(0)
      }
    }
  })

  it('keeps taglines and descriptions inside their layout budgets', () => {
    for (const entry of entries) {
      expect(entry.tagline.length, `${entry.slug} tagline is too long`).toBeLessThanOrEqual(60)
      const words = entry.description.trim().split(/\s+/).length
      expect(words, `${entry.slug} description is too long`).toBeLessThanOrEqual(35)
    }
  })

  it('has no em-dashes or en-dashes in any user-visible string', () => {
    const visible = entries.flatMap((entry) => [
      entry.name,
      entry.tagline,
      entry.description,
      entry.commandLabel,
      entry.urlLabel,
      entry.license ?? '',
      ...entry.triggers,
    ])
    for (const text of visible) {
      expect(text).not.toContain('\u2014')
      expect(text).not.toContain('\u2013')
    }
  })

  it('marks a small number of entries as featured for the homepage', () => {
    const featured = entries.filter((entry) => entry.featured)
    expect(featured.length).toBeGreaterThan(0)
    // A couple per kind at most, out of a catalog of roughly a hundred.
    expect(featured.length).toBeLessThanOrEqual(10)
  })

  it('keeps skills as the largest single kind, since the site is a skills showcase', () => {
    const skills = entries.filter((entry) => entry.kind === 'skill')
    const harnesses = entries.filter((entry) => entry.kind === 'harness')
    expect(skills.length).toBeGreaterThan(harnesses.length)
  })
})
