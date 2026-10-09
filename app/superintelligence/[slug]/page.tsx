import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Books, Cube, Warning } from '@phosphor-icons/react/ssr'
import type { Metadata } from 'next'
import {
  formatAfterDate,
  getAfterEntryBySlug,
  getAfterSlugs,
  getRelatedAfter,
} from '@/lib/superintelligence'
import { KIND_META } from '@/content/superintelligence'
import { getEntryBySlug } from '@/lib/registry'
import { SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAfterSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getAfterEntryBySlug(slug)
  if (!entry) return { title: 'Entry not found' }

  return {
    title: entry.title,
    description: entry.summary,
    openGraph: {
      title: `${entry.title} | wow-repo`,
      description: entry.summary,
      type: 'article',
      ...(entry.date ? { publishedTime: entry.date } : {}),
      url: `${SITE_URL}/superintelligence/${entry.slug}`,
      images: ['/opengraph-image.png'],
    },
  }
}

export default async function AfterEntryPage({ params }: PageProps) {
  const { slug } = await params
  const entry = getAfterEntryBySlug(slug)

  if (!entry) notFound()

  const related = getRelatedAfter(entry, 2)
  const relatedSkills = (entry.skills ?? [])
    .map((skillSlug) => getEntryBySlug(skillSlug))
    .filter((skill) => skill !== undefined)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.summary,
    ...(entry.date ? { datePublished: entry.date } : {}),
    url: `${SITE_URL}/superintelligence/${entry.slug}`,
    author: { '@type': 'Organization', name: entry.org },
    publisher: { '@type': 'Organization', name: 'wow-repo' },
    isBasedOn: { '@type': 'Article', url: entry.source.url },
  }

  return (
    <article className="container-x py-16 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/superintelligence"
        className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft weight="regular" className="h-4 w-4" />
        After the world
      </Link>

      <header className="mt-8 max-w-[70ch]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border-line bg-surface text-accent rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
            {KIND_META[entry.kind].label}
          </span>
          <span className="border-line bg-surface text-muted rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
            {entry.topic}
          </span>
          {entry.date && <span className="mono-label ml-1">{formatAfterDate(entry.date)}</span>}
        </div>

        <h1 className="mt-6 text-4xl leading-[1.08] font-bold tracking-tighter sm:text-5xl">
          {entry.title}
        </h1>
        {entry.kind === 'quote' ? (
          <blockquote className="border-accent text-ink mt-6 border-l-2 pl-5 text-2xl leading-snug font-medium tracking-tight">
            &ldquo;{entry.summary}&rdquo;
          </blockquote>
        ) : (
          <p className="text-muted mt-5 text-xl leading-snug">{entry.summary}</p>
        )}
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <p className="text-ink/90 max-w-[65ch] text-lg leading-relaxed">{entry.detail}</p>

          {entry.caveat && (
            <div className="border-line bg-elevated mt-10 rounded-2xl border p-6">
              <h2 className="text-muted flex items-center gap-2 text-sm font-semibold tracking-[0.14em] uppercase">
                <Warning weight="regular" className="h-4 w-4" />
                The limit
              </h2>
              <p className="text-muted mt-3 max-w-[62ch] leading-relaxed">{entry.caveat}</p>
            </div>
          )}

          {relatedSkills.length > 0 && (
            <section className="border-line mt-12 border-t pt-10">
              <h2 className="text-muted text-sm font-semibold tracking-[0.14em] uppercase">
                Verify it with these skills
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {relatedSkills.map((skill) => (
                  <Link
                    key={skill.slug}
                    href={`/skills/${skill.slug}`}
                    className="border-line bg-surface hover:border-ink/25 flex items-start gap-3 rounded-2xl border p-5 transition-colors"
                  >
                    <Cube weight="regular" className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="text-ink block text-sm font-medium">{skill.name}</span>
                      <span className="text-muted mt-1 block text-sm">{skill.tagline}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border-line bg-elevated rounded-2xl border p-6">
            {entry.figure && (
              <>
                <h2 className="text-muted text-sm font-semibold tracking-[0.14em] uppercase">
                  The figure
                </h2>
                <p className="text-ink mt-4 font-mono text-4xl tracking-tighter">
                  {entry.figure.value}
                </p>
                <p className="text-muted mt-2 text-sm leading-relaxed">{entry.figure.label}</p>
                <div className="border-line mt-6 border-t" />
              </>
            )}

            <h2 className="text-muted mt-6 text-sm font-semibold tracking-[0.14em] uppercase">
              Source
            </h2>
            <a
              href={entry.source.url}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-surface hover:border-ink/25 mt-4 flex items-start justify-between gap-3 rounded-lg px-4 py-3 transition-colors"
            >
              <span className="text-ink text-sm leading-relaxed">{entry.source.label}</span>
              <ArrowUpRight weight="regular" className="text-accent mt-0.5 h-4 w-4 shrink-0" />
            </a>

            <dl className="border-line mt-6 space-y-4 border-t pt-5">
              <div>
                <dt className="mono-label">By</dt>
                <dd className="text-ink mt-1 text-sm leading-relaxed">{entry.org}</dd>
              </div>
              <div>
                <dt className="mono-label">Kind</dt>
                <dd className="text-ink mt-1 text-sm">{KIND_META[entry.kind].label}</dd>
              </div>
              <div>
                <dt className="mono-label">Topic</dt>
                <dd className="text-ink mt-1 text-sm">{entry.topic}</dd>
              </div>
            </dl>

            <p className="border-line text-muted mt-6 flex items-start gap-2 border-t pt-5 text-xs leading-relaxed">
              <Books weight="regular" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Every number on this page is quoted from the linked source rather than estimated.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-line mt-20 border-t pt-12">
          <h2 className="text-3xl font-bold tracking-tighter">Keep reading</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/superintelligence/${item.slug}`}
                className="border-line bg-surface hover:border-ink/25 flex flex-col rounded-2xl border p-6 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="mono-label text-accent">{KIND_META[item.kind].label}</span>
                  <span className="mono-label">
                    {item.date ? formatAfterDate(item.date) : item.topic}
                  </span>
                </div>
                <h3 className="mt-4 text-lg leading-snug font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted mt-3 line-clamp-3 text-sm leading-relaxed">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
