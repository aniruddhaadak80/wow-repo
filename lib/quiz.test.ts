import { describe, expect, it } from 'vitest'
import { getGlossary } from '@/lib/glossary'
import { buildQuiz, quizSize } from './quiz'

/*
 * A quiz is only fair if the answer is always among the options, the options are
 * distinct, and the same seed gives the same paper. Those are the three things
 * worth testing, plus the fact that every question traces back to a real term.
 */
describe('glossary quiz', () => {
  it('asks about real terms only', () => {
    const known = new Set(getGlossary().map((item) => item.term))
    for (const question of buildQuiz(8, 1)) {
      expect(known.has(question.term)).toBe(true)
      expect(known.has(question.answer)).toBe(true)
      expect(question.definition.length).toBeGreaterThan(0)
    }
  })

  it('always includes the answer in the options', () => {
    for (let seed = 1; seed <= 5; seed += 1) {
      for (const question of buildQuiz(6, seed)) {
        expect(question.options).toContain(question.answer)
      }
    }
  })

  it('offers four distinct options per question', () => {
    for (const question of buildQuiz(8, 3)) {
      expect(question.options).toHaveLength(4)
      expect(new Set(question.options).size).toBe(4)
    }
  })

  it('is deterministic for a seed and differs across seeds', () => {
    expect(buildQuiz(6, 7)).toEqual(buildQuiz(6, 7))
    const a = buildQuiz(6, 1).map((question) => question.term)
    const b = buildQuiz(6, 2).map((question) => question.term)
    expect(a).not.toEqual(b)
  })

  it('never asks the same term twice in one paper', () => {
    const terms = buildQuiz(10, 4).map((question) => question.term)
    expect(new Set(terms).size).toBe(terms.length)
  })

  it('never returns more questions than the glossary holds', () => {
    const total = quizSize()
    expect(buildQuiz(total + 50, 1).length).toBeLessThanOrEqual(total)
  })
})
