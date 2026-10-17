import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SkillCard } from '@/components/skill-card'
import { CRAFTS, KINDS } from '@/content/registry'
import type { Craft } from '@/content/registry'
import { getCraftView, getRelatedCrafts } from '@/lib/taxonomy'
import { SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ craft: string }>
}

function resolveCraft(slug: string): Craft | undefined {
  return CRAFTS.find((craft) => craft.toLowerCase() === slug)
}

export async function generateStaticParams() {
  return CRAFTS.map((craft) => ({ craft: craft.toLowerCase() }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { craft: slug } = await params
  const craft = resolveCraft(slug)
  if (!craft) return { title: 'Craft not found' }
  const view = getCraftView(craft)

  return {
    title: `${craft} in the registry`,
    description: `${view.count} entries in the ${craft} craft: ${view.topTriggers
      .slice(0, 4)
      .map((row) => row.trigger)
      .join(', ')}.`,
  }
}

export default async function CraftPage({ params }: PageProps) {
  const { craft: slug } = await params
  const craft = resolveCraft(slug)
  if (!craft) notFound()

  const view = getCraftView(craft)
  const related = getRelatedCrafts(craft)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${craft} in the registry`,
    url: `${SITE_URL}/crafts/${craft.toLowerCase()}`,
    about: craft,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: view.count,
      itemListElement: view.entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.name,
        url: `${SITE_URL}/skills/${entry.slug}`,
      })),
    },
  }

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-muted flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase">
        <Link href="/crafts" className="hover:text-ink transition-colors">
          Crafts
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{craft}</span>
      </nav>

      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        {craft}
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {view.count} {view.count === 1 ? 'entry' : 'entries'} in this craft. The words this corner
        of the catalog leans on most:{' '}
        {view.topTriggers
          .slice(0, 5)
          .map((row) => row.trigger)
          .join(', ')}
        .
      </p>

      {view.newest && (
        <p className="border-line bg-elevated text-muted mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-4 py-3 text-sm">
          <span className="text-ink font-medium">Newest here:</span>
          <Link
            href={`/skills/${view.newest.slug}`}
            className="text-ink underline underline-offset-4"
          >
            {view.newest.name}
          </Link>
          <span>added {view.newest.addedAt}</span>
        </p>
      )}

      <div className="mt-16 space-y-14">
        {KINDS.filter((kind) => view.byKind[kind] > 0).map((kind) => {
          const kindEntries = view.entries.filter((entry) => entry.kind === kind)
          return (
            <div key={kind}>
              <div className="border-line mb-6 flex items-baseline justify-between gap-3 border-b pb-3">
                <h2 className="text-ink text-2xl font-semibold tracking-tight">{kind}</h2>
                <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                  {kindEntries.length}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {kindEntries.map((entry) => (
                  <SkillCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {related.length > 0 && (
        <div className="border-line mt-16 border-t pt-8">
          <p className="text-muted text-sm">
            Related crafts:{' '}
            {related.map((other, index) => (
              <span key={other}>
                {index > 0 && ' · '}
                <Link
                  href={`/crafts/${other.toLowerCase()}`}
                  className="text-ink underline underline-offset-4"
                >
                  {other}
                </Link>
              </span>
            ))}
          </p>
        </div>
      )}
    </section>
  )
}
