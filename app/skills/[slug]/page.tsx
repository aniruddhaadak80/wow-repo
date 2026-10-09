import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Clock } from '@phosphor-icons/react/ssr'
import type { Metadata } from 'next'
import { CopyButton } from '@/components/copy-button'
import { SkillCard } from '@/components/skill-card'
import { formatEntryDate, getEntryBySlug, getRelatedEntries, getSkillSlugs } from '@/lib/registry'
import { SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getSkillSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const entry = getEntryBySlug(slug)
  if (!entry) return { title: 'Skill not found' }

  return {
    title: entry.name,
    description: entry.tagline,
    openGraph: {
      title: `${entry.name} | wow-repo`,
      description: entry.tagline,
      type: 'website',
      url: `${SITE_URL}/skills/${entry.slug}`,
      images: ['/opengraph-image'],
    },
  }
}

export default async function SkillPage(props: PageProps) {
  const { slug } = await props.params
  const entry = getEntryBySlug(slug)

  if (!entry) notFound()

  const related = getRelatedEntries(entry, 3).filter((item) => item.kind === 'skill')
  const runCommand = `wow run ${entry.name}`

  return (
    <article className="container-x py-16 lg:py-20">
      <Link
        href="/skills"
        className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft weight="regular" className="h-4 w-4" />
        All skills
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <span className="border-line text-muted rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
            {entry.craft}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
            {entry.name}
          </h1>
          <p className="text-muted mt-4 text-xl leading-snug">{entry.tagline}</p>
          <p className="text-ink/90 mt-6 max-w-[65ch] text-lg leading-relaxed">
            {entry.description}
          </p>

          <div className="mt-10">
            <h2 className="text-muted text-sm font-semibold tracking-[0.14em] uppercase">
              Triggers
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.triggers.map((trigger) => (
                <span
                  key={trigger}
                  className="border-line bg-surface text-muted rounded-full border px-3.5 py-1.5 font-mono text-xs"
                >
                  {trigger}
                </span>
              ))}
            </div>
          </div>

          <dl className="border-line mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-3">
            <div>
              <dt className="mono-label flex items-center gap-1.5">
                <Clock weight="regular" className="h-3.5 w-3.5" />
                Added
              </dt>
              <dd className="text-ink mt-1 font-mono text-lg">{formatEntryDate(entry.addedAt)}</dd>
            </div>
            <div>
              <dt className="mono-label">Craft</dt>
              <dd className="text-ink mt-1 font-mono text-lg">{entry.craft}</dd>
            </div>
            <div>
              <dt className="mono-label">Format</dt>
              <dd className="text-ink mt-1 font-mono text-lg">markdown</dd>
            </div>
          </dl>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border-line bg-elevated rounded-2xl border p-6">
            <h2 className="text-muted text-sm font-semibold tracking-[0.14em] uppercase">
              {entry.commandLabel}
            </h2>
            <div className="bg-surface mt-4 flex items-center justify-between gap-3 rounded-lg px-4 py-3">
              <code className="text-ink truncate font-mono text-xs">{entry.command}</code>
              <CopyButton text={entry.command} />
            </div>

            <h2 className="text-muted mt-6 text-sm font-semibold tracking-[0.14em] uppercase">
              Run
            </h2>
            <div className="bg-surface mt-4 flex items-center justify-between gap-3 rounded-lg px-4 py-3">
              <code className="text-ink truncate font-mono text-xs">{runCommand}</code>
              <CopyButton text={runCommand} />
            </div>

            <p className="text-muted mt-5 text-xs leading-relaxed">
              Sample commands for the demo catalog. Wire these to a real registry before shipping.
            </p>
          </div>
        </aside>
      </div>

      <section className="border-line mt-20 border-t pt-12">
        <h2 className="text-3xl font-bold tracking-tighter">Related skills</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((relatedEntry) => (
            <SkillCard key={relatedEntry.slug} entry={relatedEntry} />
          ))}
        </div>
      </section>

      <div className="mt-16 flex justify-center">
        <Link
          href="/#swarms"
          className="text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:brightness-110"
        >
          See the swarm demo
          <ArrowUpRight weight="regular" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
