import { describe, expect, it } from 'vitest'
import { entries, KINDS, KIND_META, TOPICS } from './superintelligence'
import { entries as registryEntries } from './registry'

/*
 * Data integrity guard for the After the world collection. Same contract as
 * the frontier log, with two twists: dates are optional (researchers carry
 * none) and every referenced skill must resolve to a real catalog slug.
 */
describe('superintelligence dataset integrity', () => {
  it('is a real collection, not a stub', () => {
    expect(entries.length).toBeGreaterThanOrEqual(20)
  })

  it('uses unique slugs', () => {
    const slugs = entries.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('only uses declared kinds and topics', () => {
    for (const entry of entries) {
      expect(KINDS, entry.slug).toContain(entry.kind)
      expect(TOPICS, entry.slug).toContain(entry.topic)
    }
  })

  it('labels every kind it ships', () => {
    for (const kind of KINDS) {
      expect(KIND_META[kind].label.length, kind).toBeGreaterThan(0)
      expect(KIND_META[kind].blurb.length, kind).toBeGreaterThan(20)
    }
  })

  it('covers every kind and every topic', () => {
    for (const kind of KINDS) {
      expect(
        entries.some((entry) => entry.kind === kind),
        `no entries of kind ${kind}`,
      ).toBe(true)
    }
    for (const topic of TOPICS) {
      expect(
        entries.some((entry) => entry.topic === topic),
        `no entries on topic ${topic}`,
      ).toBe(true)
    }
  })

  it('keeps every date it carries at a precision the renderer supports', () => {
    for (const entry of entries) {
      if (entry.date === undefined) continue
      expect(entry.date, entry.slug).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    }
  })

  it('ships every entry with a real https source', () => {
    for (const entry of entries) {
      expect(entry.source.label.length, entry.slug).toBeGreaterThan(0)
      expect(entry.source.url, entry.slug).toMatch(/^https:\/\/[^\s]+$/)
    }
  })

  it('points every referenced skill at a slug that exists in the catalog', () => {
    const catalog = new Set(registryEntries.map((entry) => entry.slug))
    for (const entry of entries) {
      for (const slug of entry.skills ?? []) {
        expect(catalog.has(slug), `${entry.slug} references unknown skill ${slug}`).toBe(true)
      }
    }
  })

  it('attaches a caveat to every entry that carries a figure', () => {
    for (const entry of entries) {
      if (!entry.figure) continue
      expect(entry.caveat, `${entry.slug} shows a number with no caveat`).toBeDefined()
      expect(entry.caveat?.length ?? 0, entry.slug).toBeGreaterThan(20)
    }
  })

  it('keeps summaries short enough to scan', () => {
    for (const entry of entries) {
      const words = entry.summary.trim().split(/\s+/).length
      expect(words, `${entry.slug} summary is too long`).toBeLessThanOrEqual(30)
    }
  })

  it('keeps quotes short enough to read at a glance', () => {
    for (const entry of entries) {
      if (entry.kind !== 'quote') continue
      expect(entry.summary.length, `${entry.slug} quote is too long`).toBeLessThanOrEqual(160)
    }
  })

  it('has no em-dashes or en-dashes in any user-visible string', () => {
    const visible = entries.flatMap((entry) => [
      entry.title,
      entry.summary,
      entry.detail,
      entry.org,
      entry.source.label,
      entry.figure?.value ?? '',
      entry.figure?.label ?? '',
      entry.caveat ?? '',
    ])
    for (const text of visible) {
      expect(text).not.toContain('—')
      expect(text).not.toContain('–')
    }
  })

  it('marks a small number of entries as featured for the homepage', () => {
    const featured = entries.filter((entry) => entry.featured)
    expect(featured.length).toBeGreaterThan(0)
    expect(featured.length).toBeLessThanOrEqual(4)
  })
})
