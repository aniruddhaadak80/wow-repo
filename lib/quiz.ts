import { getGlossary, type GlossaryTerm } from '@/lib/glossary'

/**
 * The glossary quiz: read the definition, pick the term.
 *
 * Questions are generated from the same glossary the /glossary page renders, so
 * the quiz can never ask about a term the site does not define. Generation is
 * seeded, which means a given seed always yields the same paper: the tests can
 * assert an exact shape, and the UI can offer a stable "paper 1, paper 2" rather
 * than reshuffling on every render.
 */

export interface QuizQuestion {
  id: string
  /** The term the question is about (the answer). */
  term: string
  /** The definition shown as the prompt. */
  definition: string
  detail?: string
  /** Four terms, one of which is correct. */
  options: string[]
  answer: string
}

/** A tiny seeded PRNG (mulberry32). Same seed, same sequence, everywhere. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return function next() {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    const swap = copy[i]
    copy[i] = copy[j]
    copy[j] = swap
  }
  return copy
}

/**
 * Build a paper of `count` questions from the glossary. Each question offers the
 * correct term plus three distractors, shuffled with the same seeded generator.
 */
export function buildQuiz(count = 8, seed = 1): QuizQuestion[] {
  const terms = getGlossary()
  if (terms.length < 4) return []

  const rand = mulberry32(seed)
  const chosen = shuffle(terms, rand).slice(0, Math.min(count, terms.length))

  return chosen.map((term) => {
    const others = terms.filter((item) => item.term !== term.term)
    const distractors = shuffle(others, rand).slice(0, 3)
    const options = shuffle([term.term, ...distractors.map((item) => item.term)], rand)
    return {
      id: term.term,
      term: term.term,
      definition: term.definition,
      detail: term.detail,
      options,
      answer: term.term,
    }
  })
}

/** How many distinct papers of this size the glossary can make, roughly. */
export function quizSize(terms: GlossaryTerm[] = getGlossary()): number {
  return terms.length
}
