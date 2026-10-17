import Link from 'next/link'
import { KIND_META } from '@/content/registry'
import { getTimeline, getTimelineSummary } from '@/lib/timeline'

export const revalidate = 3600

export const metadata = {
  title: 'Timeline',
  description:
    'Every registry entry in the order it arrived: month by month, newest first, with the craft and kind it landed under.',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Registry timeline',
}

export default function TimelinePage() {
  const timeline = getTimeline()
  const summary = getTimelineSummary()

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <p className="eyebrow">Timeline</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        The catalog, in order.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {summary.total} entries across {summary.months} months and {summary.years}{' '}
        {summary.years === 1 ? 'year' : 'years'}. The busiest stretch was{' '}
        {summary.busiest ? summary.busiest.label : 'unknown'}, with{' '}
        {summary.busiest ? summary.busiest.count : 0}{' '}
        {summary.busiest && summary.busiest.count === 1 ? 'entry' : 'entries'}.
      </p>

      <div className="border-line bg-elevated text-muted mt-6 inline-flex rounded-lg border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase">
        Sample catalog dates
      </div>

      <div className="border-line mt-14 border-l pl-6 sm:pl-8">
        {timeline.map((year) => (
          <section key={year.year} className="mb-14 last:mb-0">
            <h2 className="text-ink flex items-baseline gap-3 text-3xl font-bold tracking-tight">
              {year.year}
              <span className="text-muted font-mono text-xs font-normal tracking-[0.14em] uppercase">
                {year.count} {year.count === 1 ? 'entry' : 'entries'}
              </span>
            </h2>

            <div className="mt-6 space-y-8">
              {year.months.map((month) => (
                <div key={month.month}>
                  <h3 className="text-muted font-mono text-sm font-medium tracking-[0.1em] uppercase">
                    {month.label}
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {month.entries.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={`/skills/${entry.slug}`}
                          className="group border-line hover:border-ink/25 flex flex-col gap-1 rounded-lg border border-transparent px-3 py-2 transition-colors sm:flex-row sm:items-baseline sm:gap-4"
                        >
                          <time
                            className="text-muted shrink-0 font-mono text-xs tabular-nums"
                            dateTime={entry.addedAt}
                          >
                            {entry.addedAt}
                          </time>
                          <span className="text-ink font-medium group-hover:underline group-hover:underline-offset-4">
                            {entry.name}
                          </span>
                          <span className="text-muted hidden flex-1 truncate text-sm lg:block">
                            {entry.tagline}
                          </span>
                          <span className="border-line text-muted shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase">
                            {KIND_META[entry.kind].label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-muted mt-12 text-sm">
        See the same data as{' '}
        <Link href="/stats" className="text-ink underline underline-offset-4">
          counts and shares
        </Link>
        , or browse by{' '}
        <Link href="/crafts" className="text-ink underline underline-offset-4">
          craft
        </Link>
        .
      </p>
    </section>
  )
}
