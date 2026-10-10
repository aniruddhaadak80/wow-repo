import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/ssr'
import { KINDS, KIND_META } from '@/content/superintelligence'
import {
  formatAfterDate,
  getAfterEntries,
  getAfterEntriesByKind,
  getFeaturedAfter,
  sortAfterByDate,
} from '@/lib/superintelligence'

/**
 * After the world: a dated timeline of scenarios beside the quote that
 * carries the section. Server Component, no motion of its own: the timeline
 * is read top to bottom, and hover states are the only movement.
 *
 * A timeline plus pull-quote family, distinct from the sticky steps, the
 * snap rail, the bento, and the centered CTA elsewhere on the page.
 */
export function WorldAfter() {
  const scenarios = sortAfterByDate(getAfterEntriesByKind('scenario')).reverse()
  const voice = getFeaturedAfter().find((entry) => entry.kind === 'quote')
  const total = getAfterEntries().length

  return (
    <section id="after" className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32">
      <div className="max-w-[65ch]">
        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          {' '}
          What the superintelligence debate actually says.
        </h2>
        <p className="text-muted mt-5 text-lg leading-relaxed">
          Four scenarios, six papers, five books, eight quotes, eight researchers. Every claim links
          to its source and states its limit.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <ol className="flex min-w-0 flex-col gap-9">
          {scenarios.map((scenario) => (
            <li key={scenario.slug} className="grid gap-2 sm:grid-cols-[7ch_1fr] sm:gap-6">
              <span className="text-accent font-mono text-sm tracking-tighter">
                {scenario.date ? formatAfterDate(scenario.date) : ''}
              </span>
              <span>
                <Link
                  href={`/superintelligence/${scenario.slug}`}
                  className="text-ink text-xl leading-snug font-semibold tracking-tight transition-opacity hover:opacity-70"
                >
                  {scenario.title}
                </Link>
                <span className="mono-label mt-2 block max-w-[44ch] leading-relaxed">
                  {scenario.org}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-8 lg:pt-1">
          {voice && (
            <figure className="border-line bg-elevated rounded-2xl border p-6 lg:p-7">
              <blockquote className="text-ink text-xl leading-snug font-medium tracking-tight">
                &ldquo;{voice.summary}&rdquo;
              </blockquote>
              <figcaption className="mono-label mt-4 leading-relaxed">{voice.org}</figcaption>
            </figure>
          )}

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {KINDS.map((kind) => (
              <div key={kind}>
                <dt className="mono-label">{KIND_META[kind].label}</dt>
                <dd className="text-ink mt-1 font-mono text-2xl tracking-tighter">
                  {getAfterEntriesByKind(kind).length}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/superintelligence"
            className="text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:brightness-110"
          >
            Read all {total} entries
            <ArrowRight weight="regular" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
