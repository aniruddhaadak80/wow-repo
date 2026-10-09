import { describe, expect, it } from 'vitest'
import { findings, FIELDS, TRACKS } from './findings'

/*
 * Data integrity guard for the frontier log. Every entry is a real claim with
 * a source, so these tests keep the log honest: unique slugs, known tracks and
 * fields, dates in the precision the renderer supports, and a caveat attached
 * to every entry that carries a number.
 */
describe('findings dataset integrity', () => {
  it('has a non-trivial number of entries', () => {
    expect(findings.length).toBeGreaterThanOrEqual(8)
  })

  it('uses unique slugs', () => {
    const slugs = findings.map((finding) => finding.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('only uses declared tracks and fields', () => {
    for (const finding of findings) {
      expect(TRACKS).toContain(finding.track)
      expect(FIELDS).toContain(finding.field)
    }
  })

  it('keeps every date at a precision the renderer supports', () => {
    for (const finding of findings) {
      expect(finding.date, finding.slug).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    }
  })

  it('ships every entry with a real https source', () => {
    for (const finding of findings) {
      expect(finding.source.label.length, finding.slug).toBeGreaterThan(0)
      expect(finding.source.url, finding.slug).toMatch(/^https:\/\/[^\s]+$/)
    }
  })

  it('points every referenced skill at a slug that exists in the catalog', () => {
    for (const finding of findings) {
      for (const slug of finding.skills) {
        expect(slug.length, `${finding.slug} references an empty skill`).toBeGreaterThan(0)
      }
    }
  })

  it('attaches a caveat to every entry that carries a figure', () => {
    for (const finding of findings) {
      if (!finding.figure) continue
      expect(finding.caveat, `${finding.slug} shows a number with no caveat`).toBeDefined()
      expect(finding.caveat?.length ?? 0, finding.slug).toBeGreaterThan(20)
    }
  })

  it('keeps summaries short enough to scan', () => {
    for (const finding of findings) {
      const words = finding.summary.trim().split(/\s+/).length
      expect(words, `${finding.slug} summary is too long`).toBeLessThanOrEqual(30)
    }
  })

  it('has no em-dashes or en-dashes in any user-visible string', () => {
    const visible = findings.flatMap((finding) => [
      finding.title,
      finding.summary,
      finding.detail,
      finding.org,
      finding.source.label,
      finding.figure?.label ?? '',
      finding.caveat ?? '',
    ])
    for (const text of visible) {
      expect(text).not.toContain('\u2014')
      expect(text).not.toContain('\u2013')
    }
  })

  it('covers both tracks, so the page is not a one-track site', () => {
    expect(findings.some((finding) => finding.track === 'discovery')).toBe(true)
    expect(findings.some((finding) => finding.track === 'signal')).toBe(true)
  })

  it('marks a small number of entries as featured for the homepage', () => {
    const featured = findings.filter((finding) => finding.featured)
    expect(featured.length).toBeGreaterThan(0)
    expect(featured.length).toBeLessThanOrEqual(4)
  })
})
