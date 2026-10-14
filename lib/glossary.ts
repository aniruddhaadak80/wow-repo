import { glossary, type GlossaryTerm } from '@/content/glossary'

export type { GlossaryTerm } from '@/content/glossary'
export { GLOSSARY_LETTERS, glossary } from '@/content/glossary'

/** Alphabetical, the way a glossary reads. */
export function getGlossary(): GlossaryTerm[] {
  return [...glossary].sort((a, b) => a.term.localeCompare(b.term))
}

export function getTermByName(term: string): GlossaryTerm | undefined {
  const needle = term.toLowerCase()
  return glossary.find((item) => item.term.toLowerCase() === needle)
}

export interface GlossaryQuery {
  q?: string
}

/** Term, definition, and detail are all searchable, prefix matches first. */
export function queryGlossary({ q = '' }: GlossaryQuery): GlossaryTerm[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return getGlossary()

  const hit = (item: GlossaryTerm) =>
    item.term.toLowerCase().includes(needle) ||
    item.definition.toLowerCase().includes(needle) ||
    (item.detail ?? '').toLowerCase().includes(needle)

  const matches = getGlossary().filter(hit)

  const prefix = matches.filter((item) => item.term.toLowerCase().startsWith(needle))
  const rest = matches.filter((item) => !item.term.toLowerCase().startsWith(needle))
  return [...prefix, ...rest]
}

export function getGlossaryCount(): number {
  return glossary.length
}
