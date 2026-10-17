import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlossaryQuiz } from './glossary-quiz'
import type { QuizQuestion } from '@/lib/quiz'

/*
 * The quiz is a small state machine: pick per question, check, read the score,
 * retry. These tests walk it through every branch, because a quiz that only
 * shows the happy path is how you ship a broken reveal. The questions are a
 * fixture, so the assertions are about behaviour and not about whichever terms
 * the glossary happens to hold today.
 */
const AGENT: QuizQuestion = {
  id: 'agent',
  term: 'agent',
  definition: 'A program that decides which steps to take toward a goal.',
  detail: 'It loops: observe, decide, act.',
  options: ['agent', 'tool', 'skill', 'loop'],
  answer: 'agent',
}

const TOOL: QuizQuestion = {
  id: 'tool',
  term: 'tool',
  definition: 'A callable capability an agent can invoke.',
  options: ['tool', 'agent', 'model', 'harness'],
  answer: 'tool',
}

function rows() {
  return screen.getAllByRole('listitem').map((item) => within(item))
}

describe('GlossaryQuiz', () => {
  it('renders every question with its options', () => {
    render(<GlossaryQuiz questions={[AGENT, TOOL]} />)
    const [first, second] = rows()
    expect(rows()).toHaveLength(2)
    expect(first.getByText(/decides which steps to take/i)).toBeInTheDocument()
    expect(first.getByRole('button', { name: 'agent' })).toBeInTheDocument()
    expect(second.getByText(/callable capability/i)).toBeInTheDocument()
    expect(second.getByRole('button', { name: 'harness' })).toBeInTheDocument()
  })

  it('keeps checking disabled until every question is answered', async () => {
    const user = userEvent.setup()
    render(<GlossaryQuiz questions={[AGENT, TOOL]} />)
    const check = screen.getByRole('button', { name: 'Check answers' })
    expect(check).toBeDisabled()
    expect(screen.getByText('Answer the remaining 2 to check them.')).toBeInTheDocument()

    await user.click(rows()[0].getByRole('button', { name: 'agent' }))
    expect(check).toBeDisabled()

    await user.click(rows()[1].getByRole('button', { name: 'tool' }))
    expect(check).toBeEnabled()
    expect(screen.getByText('Every question answered.')).toBeInTheDocument()
  })

  it('reveals the answers and the score after checking', async () => {
    const user = userEvent.setup()
    render(<GlossaryQuiz questions={[AGENT, TOOL]} />)
    await user.click(rows()[0].getByRole('button', { name: 'tool' }))
    await user.click(rows()[1].getByRole('button', { name: 'tool' }))
    await user.click(screen.getByRole('button', { name: 'Check answers' }))

    expect(screen.getByText(/Answer: agent\./)).toBeInTheDocument()
    expect(screen.getByText(/It loops: observe, decide, act\./)).toBeInTheDocument()
    expect(screen.getByText(/1 of 2 correct/)).toBeInTheDocument()
    expect(screen.getByText('Correct.')).toBeInTheDocument()
  })

  it('locks the options once the paper is checked', async () => {
    const user = userEvent.setup()
    render(<GlossaryQuiz questions={[AGENT, TOOL]} />)
    await user.click(rows()[0].getByRole('button', { name: 'agent' }))
    await user.click(rows()[1].getByRole('button', { name: 'tool' }))
    await user.click(screen.getByRole('button', { name: 'Check answers' }))

    expect(rows()[0].getByRole('button', { name: 'agent' })).toBeDisabled()
    expect(screen.getByText(/2 of 2 correct/)).toBeInTheDocument()
  })

  it('lets the reader retry the same paper', async () => {
    const user = userEvent.setup()
    render(<GlossaryQuiz questions={[AGENT, TOOL]} />)
    await user.click(rows()[0].getByRole('button', { name: 'agent' }))
    await user.click(rows()[1].getByRole('button', { name: 'tool' }))
    await user.click(screen.getByRole('button', { name: 'Check answers' }))
    await user.click(screen.getByRole('button', { name: 'Try this paper again' }))

    expect(screen.getByText('Answer the remaining 2 to check them.')).toBeInTheDocument()
    expect(rows()[0].getByRole('button', { name: 'agent' })).toBeEnabled()
  })

  it('switches between seeded papers and starts each one fresh', async () => {
    const user = userEvent.setup()
    render(
      <GlossaryQuiz
        papers={[
          { id: 1, questions: [AGENT, TOOL] },
          { id: 2, questions: [TOOL] },
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Paper 1' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(rows()[0].getByRole('button', { name: 'agent' }))
    expect(screen.getByText('1 of 2 answered')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Paper 2' }))
    expect(rows()).toHaveLength(1)
    expect(screen.getByText('0 of 1 answered')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Paper 1' }))
    expect(screen.getByText('0 of 2 answered')).toBeInTheDocument()
    expect(rows()[0].getByRole('button', { name: 'agent' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
