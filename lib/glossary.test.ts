import { describe, expect, it } from 'vitest'
import { getGlossary, queryGlossary } from './glossary'

describe('glossary queries', () => {
  it('returns the whole glossary alphabetically when nothing is asked', () => {
    const all = queryGlossary({})
    expect(all).toHaveLength(getGlossary().length)
    expect(all.map((item) => item.term)).toEqual(
      [...all.map((item) => item.term)].sort((a, b) => a.localeCompare(b)),
    )
  })

  it('matches on the term itself', () => {
    const results = queryGlossary({ q: 'context' })
    expect(results.map((item) => item.term)).toContain('context window')
  })

  it('matches on definitions and details, not just titles', () => {
    const results = queryGlossary({ q: 'nearest-neighbour' })
    expect(results.map((item) => item.term)).toContain('vector database')
  })

  it('puts prefix matches ahead of body matches', () => {
    const results = queryGlossary({ q: 'agent' })
    const firstNonPrefix = results.findIndex((item) => !item.term.toLowerCase().startsWith('agent'))
    const lastPrefix = results
      .map((item) => item.term.toLowerCase().startsWith('agent'))
      .lastIndexOf(true)
    expect(lastPrefix).toBeLessThan(firstNonPrefix === -1 ? Infinity : firstNonPrefix)
  })

  it('ignores case and surrounding whitespace', () => {
    expect(queryGlossary({ q: '  RAG ' }).map((item) => item.term)).toContain('RAG')
  })

  it('returns nothing for a term nobody would look up', () => {
    expect(queryGlossary({ q: 'zzzznotathing' })).toEqual([])
  })
})
