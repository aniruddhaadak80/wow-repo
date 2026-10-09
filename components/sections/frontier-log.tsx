import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react/ssr'
import { formatFindingDate, getFindingsByTrack, sortFindingsByDate } from '@/lib/findings'
import type { Finding } from '@/content/findings'

function formatDate(date: string): string {
  return formatFindingDate(date)
}

/**
 * The frontier log: a horizontal rail of real, sourced discoveries.
 *
 * A rail rather than a marquee, because these need reading. The one
 * infinite scroll on this page is the stack wall under the hero.
 */
export function FrontierLog() {
  const entries = sortFindingsByDate(getFindingsByTrack('discovery'))
  const [lead, ...rest] = entries

  if (!lead) return null

  return (
    <section id="frontier" className="container-x border-line scroll-mt-24 border-b py-24 lg:py-32">
      <div className="max-w-[65ch]">
        <p className="eyebrow">The frontier log</p>
        <h2 className="mt-5 text-4xl font-bold tracking-tighter sm:text-5xl">
          What the instruments turned up.
        </h2>
        <p className="text-muted mt-5 text-lg leading-relaxed">
          A running log of discoveries, each with the source it came from and the limit of the
          claim. Newest first, and nothing enters without a link.
        </p>
      </div>

      {/* Lead entry carries the only image in this section. */}
      <article className="border-line bg-surface mt-12 grid gap-8 rounded-2xl border p-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-8">
        <div className="relative min-h-[240px] overflow-hidden rounded-2xl lg:min-h-[300px]">
          <Image
            src="https://picsum.photos/seed/rubin-observatory-night-sky/1200/900"
            alt="A wide survey telescope under a dark sky, the long exposure turning the stars into a haze"
            fill
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="mono-label text-accent">{lead.field}</span>
            <span className="mono-label">{formatDate(lead.date)}</span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight lg:text-3xl">{lead.title}</h3>
          <p className="text-muted mt-4 leading-relaxed">{lead.summary}</p>

          {lead.figure && (
            <div className="border-line mt-6 border-t pt-5">
              <p className="text-ink font-mono text-3xl tracking-tighter">{lead.figure.value}</p>
              <p className="text-muted mt-1.5 max-w-[40ch] text-sm">{lead.figure.label}</p>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
            <span className="mono-label max-w-[34ch]">{lead.org}</span>
            <Link
              href={`/discoveries/${lead.slug}`}
              className="text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:brightness-110"
            >
              Read the entry
              <ArrowRight weight="regular" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>

      {/* The rest of the log as a snap rail. */}
      <div className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8">
        {rest.map((finding) => (
          <LogCard key={finding.slug} finding={finding} />
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/discoveries"
          className="text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:brightness-110"
        >
          All {entries.length} discoveries
          <ArrowRight weight="regular" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

function LogCard({ finding }: { finding: Finding }) {
  return (
    <article className="border-line bg-elevated hover:border-ink/25 flex w-[78vw] max-w-[340px] shrink-0 snap-start flex-col rounded-2xl border p-6 transition-colors sm:w-[300px]">
      <div className="flex items-center justify-between gap-3">
        <span className="mono-label text-accent">{finding.field}</span>
        <span className="mono-label">{formatDate(finding.date)}</span>
      </div>

      <h3 className="mt-4 text-lg leading-snug font-semibold tracking-tight">{finding.title}</h3>
      <p className="text-muted mt-3 line-clamp-4 text-sm leading-relaxed">{finding.summary}</p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <span className="mono-label max-w-[20ch] leading-relaxed">{finding.org}</span>
        <Link
          href={`/discoveries/${finding.slug}`}
          className="text-accent shrink-0 text-sm font-medium transition-colors hover:brightness-110"
          aria-label={`Read: ${finding.title}`}
        >
          Read
        </Link>
      </div>
    </article>
  )
}
