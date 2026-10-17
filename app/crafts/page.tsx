import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/ssr'
import { KIND_META } from '@/content/registry'
import { getCraftViews } from '@/lib/taxonomy'
import { getRegistryCounts } from '@/lib/registry'

export const revalidate = 3600

export const metadata = {
  title: 'Crafts',
  description:
    'The five crafts the registry is organised by: Design, DevEx, Content, Research, and Multimedia, each with its own corner of the catalog.',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Crafts',
  description: 'The five crafts the registry is organised by.',
}

export default function CraftsPage() {
  const crafts = getCraftViews()
  const counts = getRegistryCounts()

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <p className="eyebrow">Crafts</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Five ways to sort the stack.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        Every entry belongs to one craft: the kind of work it exists to help with. This is the
        shelf-level view of the {counts.total} entries, before you get down to a specific tool.
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crafts.map((craft) => (
          <Link
            key={craft.craft}
            href={`/crafts/${craft.craft.toLowerCase()}`}
            className="group border-line bg-surface hover:border-ink/25 flex h-full flex-col rounded-2xl border p-6 transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-ink text-2xl font-semibold tracking-tight">{craft.craft}</h2>
              <ArrowUpRight
                className="text-muted group-hover:text-accent size-5 shrink-0 transition-colors"
                aria-hidden="true"
              />
            </div>

            <p className="text-muted mt-1 font-mono text-xs tracking-[0.14em] uppercase">
              {craft.count} {craft.count === 1 ? 'entry' : 'entries'}
            </p>

            <div
              className="bg-elevated mt-5 flex h-1.5 w-full overflow-hidden rounded-full"
              aria-hidden="true"
            >
              {Object.entries(craft.byKind).map(([kind, count]) =>
                count > 0 ? (
                  <span
                    key={kind}
                    className="bg-accent h-full"
                    style={{ width: `${(count / craft.count) * 100}%` }}
                    title={`${KIND_META[kind as keyof typeof KIND_META].label}: ${count}`}
                  />
                ) : null,
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {craft.topTriggers.slice(0, 4).map((row) => (
                <span
                  key={row.trigger}
                  className="border-line text-muted rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase"
                >
                  {row.trigger}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <p className="text-muted mt-10 text-sm">
        Prefer the other axis? Browse by{' '}
        <Link href="/kinds" className="text-ink underline underline-offset-4">
          kind
        </Link>{' '}
        instead, or open the full{' '}
        <Link href="/skills" className="text-ink underline underline-offset-4">
          registry
        </Link>
        .
      </p>
    </section>
  )
}
