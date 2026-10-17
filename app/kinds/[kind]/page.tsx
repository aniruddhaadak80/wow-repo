import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SkillCard } from '@/components/skill-card'
import { CRAFTS, KINDS } from '@/content/registry'
import type { Kind } from '@/content/registry'
import { getKindView, getRelatedKinds } from '@/lib/taxonomy'
import { SITE_URL } from '@/lib/constants'

interface PageProps {
  params: Promise<{ kind: string }>
}

function resolveKind(slug: string): Kind | undefined {
  return KINDS.find((kind) => kind === slug)
}

export async function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kind: slug } = await params
  const kind = resolveKind(slug)
  if (!kind) return { title: 'Kind not found' }
  const view = getKindView(kind)

  return {
    title: `${view.label} in the registry`,
    description: `${view.blurb} ${view.count} entries in the registry.`,
  }
}

export default async function KindPage({ params }: PageProps) {
  const { kind: slug } = await params
  const kind = resolveKind(slug)
  if (!kind) notFound()

  const view = getKindView(kind)
  const related = getRelatedKinds(kind)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${view.label} in the registry`,
    url: `${SITE_URL}/kinds/${kind}`,
    about: view.label,
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
        <Link href="/kinds" className="hover:text-ink transition-colors">
          Kinds
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{view.label}</span>
      </nav>

      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        {view.label}
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">{view.blurb}</p>
      <p className="text-muted mt-3 max-w-[65ch]">
        {view.count} {view.count === 1 ? 'entry' : 'entries'} of this kind, spanning{' '}
        {CRAFTS.filter((craft) => view.byCraft[craft] > 0).length} crafts. Most common triggers:{' '}
        {view.topTriggers
          .slice(0, 5)
          .map((row) => row.trigger)
          .join(', ')}
        .
      </p>

      <div className="mt-16 space-y-14">
        {CRAFTS.filter((craft) => view.byCraft[craft] > 0).map((craft) => {
          const craftEntries = view.entries.filter((entry) => entry.craft === craft)
          return (
            <div key={craft}>
              <div className="border-line mb-6 flex items-baseline justify-between gap-3 border-b pb-3">
                <h2 className="text-ink text-2xl font-semibold tracking-tight">{craft}</h2>
                <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                  {craftEntries.length}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {craftEntries.map((entry) => (
                  <SkillCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-line mt-16 border-t pt-8">
        <p className="text-muted text-sm">
          See also:{' '}
          {related.map((other, index) => (
            <span key={other}>
              {index > 0 && ' · '}
              <Link href={`/kinds/${other}`} className="text-ink underline underline-offset-4">
                {getKindView(other).label}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
