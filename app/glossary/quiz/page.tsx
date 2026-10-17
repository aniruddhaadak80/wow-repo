import Link from 'next/link'
import { GlossaryQuiz } from '@/components/glossary-quiz'
import type { QuizPaper } from '@/components/glossary-quiz'
import { buildQuiz, quizSize } from '@/lib/quiz'

export const revalidate = 3600

export const metadata = {
  title: 'Glossary quiz',
  description:
    'Three seeded question papers over the glossary: read a definition, pick the term, then check the whole paper at once.',
}

const PER_PAPER = 8
const SEEDS = [1, 2, 3]

export default function GlossaryQuizPage() {
  const papers: QuizPaper[] = SEEDS.map((seed) => ({
    id: seed,
    questions: buildQuiz(PER_PAPER, seed),
  }))
  const terms = quizSize()

  return (
    <section className="container-x py-20 lg:py-24">
      <nav className="text-muted flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase">
        <Link href="/glossary" className="hover:text-ink transition-colors">
          Glossary
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">Quiz</span>
      </nav>

      <p className="eyebrow mt-5">Quiz</p>
      <h1 className="mt-4 max-w-[22ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Do you speak the stack?
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {papers.length} papers, {PER_PAPER} questions each, drawn from the {terms}-term glossary.
        Every question shows a definition; you pick the term it describes, then check the whole
        paper at once.
      </p>

      <GlossaryQuiz papers={papers} />

      <p className="text-muted mt-12 text-sm">
        Want the definitions instead of a test? Read the{' '}
        <Link href="/glossary" className="text-ink underline underline-offset-4">
          glossary
        </Link>
        , or see how the papers are generated in{' '}
        <Link href="/docs" className="text-ink underline underline-offset-4">
          the docs
        </Link>
        .
      </p>
    </section>
  )
}
