'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, X } from '@phosphor-icons/react'
import type { QuizQuestion } from '@/lib/quiz'
import { cn } from '@/lib/cn'

/**
 * The glossary quiz island.
 *
 * The papers are built on the server from the same glossary the /glossary page
 * renders, so a question can never ask about a term the site does not define,
 * and the client bundle never carries the glossary itself. Each paper is seeded,
 * which is why "paper 2" is always the same paper 2: the tests can assert an
 * exact shape and the reader can go back to a paper they half finished.
 */

export interface QuizPaper {
  id: number
  questions: QuizQuestion[]
}

/**
 * Two ways in, same island.
 *
 * A page that hands over several seeded papers gets the paper switcher; a page
 * that hands over a single paper just gets the questions. Neither shape can
 * invent a term, because both are built from the glossary on the server.
 */
type GlossaryQuizProps =
  { papers: QuizPaper[]; questions?: never } | { questions: QuizQuestion[]; papers?: never }

export function GlossaryQuiz(props: GlossaryQuizProps) {
  const list: QuizPaper[] = props.papers ?? [{ id: 1, questions: props.questions }]
  const [paperId, setPaperId] = useState(list[0]?.id ?? 1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const paper = list.find((item) => item.id === paperId) ?? list[0]

  const correctCount = useMemo(() => {
    if (!paper) return 0
    return paper.questions.filter((question) => answers[question.id] === question.answer).length
  }, [paper, answers])

  if (!paper) return null

  const answered = paper.questions.filter((question) => answers[question.id]).length
  const allAnswered = answered === paper.questions.length

  const choosePaper = (id: number) => {
    setPaperId(id)
    setAnswers({})
    setSubmitted(false)
  }

  const pick = (questionId: string, option: string) => {
    if (submitted) return
    setAnswers((current) => ({ ...current, [questionId]: option }))
  }

  const retry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="mt-12">
      {list.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a question paper">
            {list.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === paperId}
                onClick={() => choosePaper(item.id)}
                className={cn(
                  'h-9 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                  item.id === paperId
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
                )}
              >
                Paper {item.id}
              </button>
            ))}
          </div>

          <p className="text-muted font-mono text-xs tabular-nums" aria-live="polite">
            {answered} of {paper.questions.length} answered
          </p>
        </div>
      )}

      {list.length === 1 && (
        <p className="text-muted font-mono text-xs tabular-nums" aria-live="polite">
          {answered} of {paper.questions.length} answered
        </p>
      )}

      <ol className="mt-8 space-y-6">
        {paper.questions.map((question, index) => {
          const chosen = answers[question.id]
          const isRight = chosen === question.answer
          return (
            <li key={question.id} className="border-line bg-surface rounded-2xl border p-5 sm:p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-muted font-mono text-xs tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-ink leading-relaxed">{question.definition}</p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const selected = chosen === option
                  const showRight = submitted && option === question.answer
                  const showWrong = submitted && selected && !isRight
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={submitted}
                      aria-pressed={selected}
                      onClick={() => pick(question.id, option)}
                      className={cn(
                        'flex items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors duration-200',
                        showRight
                          ? 'border-accent bg-accent/10 text-ink'
                          : showWrong
                            ? 'border-muted/50 text-muted line-through'
                            : selected
                              ? 'border-accent text-ink'
                              : 'border-line text-muted hover:border-ink/30 hover:text-ink',
                        submitted && 'cursor-default',
                      )}
                    >
                      <span>{option}</span>
                      {showRight && (
                        <Check
                          weight="bold"
                          className="text-accent size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {showWrong && (
                        <X weight="bold" className="size-3.5 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  )
                })}
              </div>

              {submitted && (
                <p className="text-muted mt-3 text-xs">
                  {isRight ? 'Correct.' : `Answer: ${question.answer}.`}
                  {question.detail ? ` ${question.detail}` : ''}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="border-line mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        {submitted ? (
          <>
            <p className="text-ink text-lg font-medium" aria-live="polite">
              {correctCount} of {paper.questions.length} correct
              {correctCount === paper.questions.length ? '. Clean sweep.' : '.'}
            </p>
            <button
              type="button"
              onClick={retry}
              className="border-line text-ink hover:border-ink/30 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Try this paper again
            </button>
          </>
        ) : (
          <>
            <p className="text-muted text-sm">
              {allAnswered
                ? 'Every question answered.'
                : `Answer the remaining ${paper.questions.length - answered} to check them.`}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
                allAnswered
                  ? 'bg-accent text-on-accent'
                  : 'bg-elevated text-muted cursor-not-allowed',
              )}
            >
              Check answers
            </button>
          </>
        )}
      </div>

      <p className="text-muted mt-6 text-sm">
        Questions are generated from the same glossary the{' '}
        <Link href="/glossary" className="text-ink underline underline-offset-4">
          glossary page
        </Link>{' '}
        renders, so nobody can be asked about a term this site does not define.
      </p>
    </div>
  )
}
