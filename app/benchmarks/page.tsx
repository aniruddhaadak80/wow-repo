import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/ssr'
import { BenchmarkLeaderboard } from '@/components/benchmark-leaderboard'
import { Meter, StatTile } from '@/components/benchmark-primitives'
import {
  BENCHMARK_TRACKS,
  formatScore,
  getBenchmarkEntries,
  getSuiteLeaders,
  isEfficientLeader,
} from '@/lib/benchmarks'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Benchmark scoreboard',
  description:
    'Fourteen synthetic runs across two tracks, ranked on the same suites. Filter, sort, and open any run for its per-suite breakdown, latency, and cost.',
  alternates: { canonical: '/benchmarks' },
  openGraph: {
    title: 'Benchmark scoreboard | wow-repo',
    description:
      'Two tracks, fourteen runs, one scoreboard. Sample data shaped like harness output.',
    url: `${SITE_URL}/benchmarks`,
  },
}

const TRACK_LABEL: Record<(typeof BENCHMARK_TRACKS)[number], string> = {
  llm: 'Models',
  agent: 'Agent harnesses',
}

export default function BenchmarksPage() {
  const entries = getBenchmarkEntries()
  const suiteLeaders = getSuiteLeaders(entries)
  const efficient = entries.filter(isEfficientLeader)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'wow-repo benchmark runs',
    description:
      'Sample benchmark data shaped like harness output, covering two tracks and fourteen runs.',
    url: `${SITE_URL}/benchmarks`,
    creator: { '@type': 'Organization', name: 'wow-repo' },
    isAccessibleForFree: true,
  }

  return (
    <div className="container-x py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="max-w-[68ch]">
        <h1 className="text-4xl leading-[1.08] font-bold tracking-tighter sm:text-5xl">
          Benchmark scoreboard
        </h1>
        <p className="text-muted mt-5 text-lg leading-relaxed">
          Two tracks, {entries.length} runs, one table. Every number here is sample data shaped like
          harness output, so the interface is real even where the measurement is not.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENCHMARK_TRACKS.map((track) => (
          <StatTile
            key={track}
            label={TRACK_LABEL[track]}
            value={entries.filter((entry) => entry.track === track).length}
            hint="runs in this track"
          />
        ))}
        <StatTile label="suites" value={suiteLeaders.length} hint="scored per run" />
        <StatTile
          label="value leaders"
          value={efficient.length}
          hint="best score per cent in their track"
        />
      </section>

      <div className="mt-12">
        <BenchmarkLeaderboard entries={entries} />
      </div>

      <section className="border-line mt-20 border-t pt-12">
        <h2 className="text-3xl font-bold tracking-tighter">Who wins each suite</h2>
        <p className="text-muted mt-4 max-w-[62ch] leading-relaxed">
          The composite score is one number hiding five different races. Spread is the gap between
          the best and worst run on that suite, so a tight suite is a crowded one.
        </p>

        <ul className="mt-10 grid gap-4 lg:grid-cols-2">
          {suiteLeaders.map((suite) => (
            <li key={suite.label}>
              <Link
                href={`/benchmarks/${suite.leader.id}`}
                className="border-line bg-surface hover:border-ink/25 flex flex-col rounded-2xl border p-6 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-ink font-semibold tracking-tight">{suite.label}</h3>
                  <ArrowUpRight weight="regular" className="text-accent h-4 w-4 shrink-0" />
                </div>
                <p className="text-muted mt-2 text-sm">
                  {suite.leader.name} at {formatScore(suite.leader.score)}
                </p>
                <Meter
                  value={suite.leader.score}
                  label={`${suite.label} best score`}
                  className="mt-5"
                />
                <p className="mono-label mt-3">{suite.spread.toFixed(1)} point spread</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
