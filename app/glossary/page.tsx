import type { Metadata } from 'next'
import Link from 'next/link'
import { GlossaryBrowser } from '@/components/glossary-browser'
import { GlossaryEntry } from '@/components/glossary-entry'
import { getGlossary, getGlossaryCount } from '@/lib/glossary'
import { GLOSSARY_LETTERS } from '@/content/glossary'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Glossary',
  description:
    'The vocabulary of the open agent stack, defined in one place: agents, skills, MCP, retrieval, harnesses, guardrails, and the rest.',
}

export default function GlossaryPage() {
  const total = getGlossaryCount()
  const letters = GLOSSARY_LETTERS
  const sorted = getGlossary()

  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">Glossary</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        The words, defined once.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {total} terms, each written to be acted on rather than memorised. Searchable offline,
        because the whole glossary ships with the page.
      </p>

      {/* The list below is rendered on the server and handed to the search
          island: it is the real page content, and the search only hides it
          while a query is active. */}
      <GlossaryBrowser total={total}>
        <nav aria-label="Glossary letters" className="border-line mt-16 border-t pt-8">
          <p className="mono-label mb-4">Jump to a letter</p>
          <ul className="flex flex-wrap gap-2">
            {letters.map((letter) => (
              <li key={letter}>
                <a
                  href={`#${letter}`}
                  className="border-line text-muted hover:text-ink hover:border-ink/30 inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors"
                >
                  {letter}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 space-y-16">
          {letters.map((letter) => {
            const terms = sorted.filter((item) => item.term[0].toUpperCase() === letter)
            if (terms.length === 0) return null
            return (
              <section key={letter} id={letter} className="scroll-mt-24">
                <h2 className="text-accent font-mono text-sm font-bold tracking-[0.2em]">
                  {letter}
                </h2>
                <dl className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-2">
                  {terms.map((item) => (
                    <GlossaryEntry key={item.term} item={item} />
                  ))}
                </dl>
              </section>
            )
          })}
        </div>
      </GlossaryBrowser>

      <div className="border-line mt-16 border-t pt-8">
        <p className="text-muted max-w-[65ch] text-sm">
          Think you know them? Take the{' '}
          <Link href="/glossary/quiz" className="text-ink underline underline-offset-4">
            glossary quiz
          </Link>
          : three seeded papers, eight terms each, generated from this same list.
        </p>
      </div>
    </section>
  )
}
