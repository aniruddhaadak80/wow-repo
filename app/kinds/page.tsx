import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/ssr'
import { getKindViews } from '@/lib/taxonomy'
import { getRegistryCounts } from '@/lib/registry'

export const revalidate = 3600

export const metadata = {
  title: 'Kinds',
  description:
    'Skills, MCP servers, APIs, protocols, harnesses, and software: the six shapes an entry can take in the registry.',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Kinds',
  description: 'The six shapes an entry can take in the registry.',
}

export default function KindsPage() {
  const kinds = getKindViews()
  const counts = getRegistryCounts()

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <p className="eyebrow">Kinds</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Six shapes in the stack.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        A craft says what an entry is <em>for</em>. A kind says what it <em>is</em>: something you
        install, a server you call, a spec you read, or a runtime you run. Here are all{' '}
        {counts.total} entries by shape.
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kinds.map((kind) => (
          <Link
            key={kind.kind}
            href={`/kinds/${kind.kind}`}
            className="group border-line bg-surface hover:border-ink/25 flex h-full flex-col rounded-2xl border p-6 transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-ink text-2xl font-semibold tracking-tight">{kind.label}</h2>
              <ArrowUpRight
                className="text-muted group-hover:text-accent size-5 shrink-0 transition-colors"
                aria-hidden="true"
              />
            </div>
            <p className="text-muted mt-1 font-mono text-xs tracking-[0.14em] uppercase">
              {kind.count} {kind.count === 1 ? 'entry' : 'entries'}
            </p>
            <p className="text-muted mt-4 text-sm leading-relaxed">{kind.blurb}</p>
          </Link>
        ))}
      </div>

      <p className="text-muted mt-10 text-sm">
        Prefer the other axis? Browse by{' '}
        <Link href="/crafts" className="text-ink underline underline-offset-4">
          craft
        </Link>
        , or jump straight to a term in the{' '}
        <Link href="/glossary" className="text-ink underline underline-offset-4">
          glossary
        </Link>
        .
      </p>
    </section>
  )
}
