import { describe, expect, it } from 'vitest'
import { GLOSSARY_LETTERS, glossary } from './glossary'

/*
 * The glossary is content, so it gets the dataset treatment: unique terms,
 * real definitions, a seeAlso graph that only points at terms that exist,
 * and no em-dashes in anything a reader sees.
 */
describe('glossary content', () => {
  it('is a real glossary, not a stub', () => {
    expect(glossary.length).toBeGreaterThanOrEqual(20)
  })

  it('has unique terms, compared case-insensitively', () => {
    const terms = glossary.map((item) => item.term.toLowerCase())
    expect(new Set(terms).size).toBe(terms.length)
  })

  it('gives every term a definition a newcomer can act on', () => {
    for (const item of glossary) {
      expect(item.definition.length, item.term).toBeGreaterThan(80)
      if (item.detail) expect(item.detail.length, item.term).toBeGreaterThan(80)
    }
  })

  it('only links seeAlso to terms that exist', () => {
    const known = new Set(glossary.map((item) => item.term.toLowerCase()))
    for (const item of glossary) {
      for (const ref of item.seeAlso ?? []) {
        expect(known, `${item.term} links to ${ref}`).toContain(ref.toLowerCase())
      }
    }
  })

  it('never links a term to itself', () => {
    for (const item of glossary) {
      expect(item.seeAlso ?? [], item.term).not.toContain(item.term)
    }
  })

  it('only tags kinds that exist', () => {
    for (const item of glossary) {
      for (const kind of item.kinds ?? []) {
        expect(['skill', 'mcp', 'api', 'protocol', 'harness', 'software']).toContain(kind)
      }
    }
  })

  it('derives letters for the jump nav, sorted and unique', () => {
    expect(GLOSSARY_LETTERS).toEqual([...GLOSSARY_LETTERS].sort())
    expect(new Set(GLOSSARY_LETTERS).size).toBe(GLOSSARY_LETTERS.length)
    for (const letter of GLOSSARY_LETTERS) {
      expect(glossary.some((item) => item.term[0].toUpperCase() === letter)).toBe(true)
    }
  })

  it('has no em-dashes in anything a reader sees', () => {
    for (const item of glossary) {
      for (const text of [item.term, item.definition, item.detail ?? '']) {
        expect(text).not.toContain('\u2014')
      }
    }
  })
})
