import { describe, expect, it } from 'vitest'
import { DOC_GROUPS, docs } from './docs'

/*
 * The docs are content, so they get the same treatment as the datasets:
 * unique slugs, declared groups, real prose, and no page left stranded.
 */
describe('docs content', () => {
  it('has unique slugs', () => {
    const slugs = docs.map((doc) => doc.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('only uses declared groups, and every group has at least one page', () => {
    for (const doc of docs) {
      expect(DOC_GROUPS).toContain(doc.group)
    }
    for (const group of DOC_GROUPS) {
      expect(docs.filter((doc) => doc.group === group).length).toBeGreaterThan(0)
    }
  })

  it('gives every page a summary and at least one section', () => {
    for (const doc of docs) {
      expect(doc.summary.length, doc.slug).toBeGreaterThan(40)
      expect(doc.sections.length, doc.slug).toBeGreaterThan(0)
    }
  })

  it('writes prose, not headings alone', () => {
    for (const doc of docs) {
      for (const section of doc.sections) {
        expect(section.heading.length, doc.slug).toBeGreaterThan(3)
        expect(section.body.length, `${doc.slug}/${section.heading}`).toBeGreaterThan(80)
      }
    }
  })

  it('gives every code block a label and real source', () => {
    const blocks = docs.flatMap((doc) =>
      doc.sections.flatMap((section) => (section.code ?? []).map((code) => ({ doc, code }))),
    )
    expect(blocks.length).toBeGreaterThan(0)
    for (const { code } of blocks) {
      expect(code.label.length).toBeGreaterThan(0)
      expect(code.source.trim().length, code.label).toBeGreaterThan(10)
    }
  })

  it('keeps a stable slug order that covers the deploy page', () => {
    const slugs = docs.map((doc) => doc.slug)
    expect(slugs).toContain('deploy')
    expect(docs.map((doc) => doc.slug)).toEqual(slugs)
  })
})
