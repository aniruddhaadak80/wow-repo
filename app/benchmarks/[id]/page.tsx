import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/ssr'
import { Efficiency, Meter, StatTile, SuiteTable } from '@/components/benchmark-primitives'
import {
  formatCost,
  formatDate,
  formatDelta,
  formatLatency,
  formatScore,
  getBenchmarkIds,
  getEntryById,
  getRelatedEntries,
  isEfficientLeader,
  rankEntries,
} from '@/lib/benchmarks'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return getBenchmarkIds().map((id) => ({ id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const entry = getEntryById(id)
  if (!entry) return { title: 'Run not found' }

  const description = `${entry.name} (${entry.org}) scores ${formatScore(entry.score)} out of 100 on the wow-repo sample benchmark, at ${formatCost(entry.cost)} per task and ${formatLatency(entry.latency)} median latency.`

  return {
    title: `${entry.name} benchmark`,
    description,
    alternates: { canonical: `/benchmarks/${entry.id}` },
    openGraph: {
      title: `${entry.name} | wow-repo benchmarks`,
      description,
      url: `${SITE_URL}/benchmarks/${entry.id}`,
    },
  }
}

export default async function BenchmarkRunPage({ params }: PageProps) {
  const { id } = await params
  const entry = getEntryById(id)
  if (!entry) notFound()

  // Rank is always computed against the whole track, never just this page.
  const ranked = rankEntries([entry])[0]
  const related = getRelatedEntries(entry, 4)
  const valueLeader = isEfficientLeader(entry)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${entry.name} benchmark run`,
    description: `Sample benchmark run for ${entry.name} by ${entry.org}.`,
    url: `${SITE_URL}/benchmarks/${entry.id}`,
    dateModified: entry.updatedAt,
    creator: { '@type': 'Organization', name: entry.org },
    variableMeasured: entry.breakdown.map((item) => ({
      '@type': 'PropertyValue',
      name: item.label,
      value: item.score,
    })),
  }

  return (
    <article className="container-x py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/benchmarks"
        className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft weight="regular" className="h-4 w-4" />
        Scoreboard
      </Link>

      <header className="mt-8 max-w-[70ch]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border-line bg-surface text-accent rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
            {entry.org}
          </span>
          <span className="border-line bg-surface text-muted rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
            {entry.track === 'llm' ? 'Model' : 'Agent harness'}
          </span>
          <span className="mono-label ml-1">updated {formatDate(entry.updatedAt)}</span>
        </div>

        <h1 className="mt-6 text-4xl leading-[1.08] font-bold tracking-tighter sm:text-5xl">
          {entry.name}
        </h1>
        <p className="text-muted mt-5 text-xl leading-snug">
          Rank {ranked.rank} of {getBenchmarkIds().length} with a composite score of{' '}
          {formatScore(entry.score)} out of 100.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="composite"
          value={formatScore(entry.score)}
          hint="mean across every suite"
        />
        <StatTile
          label="change"
          value={formatDelta(entry.delta)}
          hint="points against the previous run"
        />
        <StatTile
          label="latency"
          value={formatLatency(entry.latency)}
          hint="median per completed task"
        />
        <Efficiency entry={entry} />
      </section>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <section>
          <h2 className="text-3xl font-bold tracking-tighter">Suite breakdown</h2>
          <p className="text-muted mt-4 max-w-[58ch] leading-relaxed">
            The composite is the mean of these suites. A strong average can still hide one weak
            suite, which is exactly what this table is for.
          </p>
          <div className="mt-8">
            <SuiteTable suites={entry.breakdown} />
          </div>

          {valueLeader && (
            <p className="border-line text-muted mt-10 flex items-start gap-2 border-t pt-6 text-sm leading-relaxed">
              <ArrowUpRight weight="regular" className="text-accent mt-0.5 h-4 w-4 shrink-0" />
              Best score per cent in the {entry.track === 'llm' ? 'model' : 'harness'} track.
            </p>
          )}
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border-line bg-elevated rounded-2xl border p-6">
            <h2 className="text-muted text-sm font-semibold tracking-[0.14em] uppercase">
              Run facts
            </h2>
            <dl className="border-line mt-5 space-y-4 border-t pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="mono-label">cost per task</dt>
                <dd className="text-ink font-mono text-sm">{formatCost(entry.cost)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="mono-label">latency</dt>
                <dd className="text-ink font-mono text-sm">{formatLatency(entry.latency)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="mono-label">suites</dt>
                <dd className="text-ink font-mono text-sm">{entry.breakdown.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="mono-label">updated</dt>
                <dd className="text-ink font-mono text-sm">{formatDate(entry.updatedAt)}</dd>
              </div>
            </dl>

            <Meter value={entry.score} label={`${entry.name} composite score`} className="mt-6" />

            <p className="border-line text-muted mt-6 border-t pt-5 text-xs leading-relaxed">
              Sample data. The table, the ranking, and the filters are real; the measurement is not.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-line mt-20 border-t pt-12">
          <h2 className="text-3xl font-bold tracking-tighter">Compare against</h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/benchmarks/${item.id}`}
                  className="border-line bg-surface hover:border-ink/25 flex h-full flex-col rounded-2xl border p-5 transition-colors"
                >
                  <span className="text-ink text-sm font-medium">{item.name}</span>
                  <span className="mono-label mt-1">{item.org}</span>
                  <span className="text-ink mt-4 font-mono text-xl tracking-tighter">
                    {formatScore(item.score)}
                  </span>
                  <Meter
                    value={item.score}
                    label={`${item.name} composite score`}
                    className="mt-3"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
