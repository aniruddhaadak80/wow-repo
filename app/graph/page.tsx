import Link from 'next/link'
import { RelationshipMap } from '@/components/relationship-map'
import type { MapNode } from '@/components/relationship-map'
import { entries } from '@/content/registry'
import { getStrongestPairs, getTriggerGraph, layoutGraph, type TriggerGraph } from '@/lib/relations'

export const revalidate = 3600

export const metadata = {
  title: 'Relationships',
  description:
    'Which problems travel together: a map of registry triggers, joined by the entries that carry them both.',
}

const MAX_ENTRIES_PER_NODE = 12

/** The placed nodes, each carrying the entries that put it on the map. */
function toMapNodes(graph: TriggerGraph): MapNode[] {
  return layoutGraph(graph).map((node) => ({
    id: node.id,
    label: node.label,
    count: node.count,
    craft: node.craft,
    x: Number(node.x.toFixed(4)),
    y: Number(node.y.toFixed(4)),
    r: Number(node.r.toFixed(4)),
    entries: entries
      .filter((entry) => entry.triggers.includes(node.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, MAX_ENTRIES_PER_NODE)
      .map((entry) => ({ slug: entry.slug, name: entry.name })),
  }))
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Registry relationships',
}

export default function GraphPage() {
  const graph = getTriggerGraph(2, 2, 22)
  const nodes = toMapNodes(graph)
  const pairs = getStrongestPairs(graph, 8)

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <p className="eyebrow">Relationships</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        What travels together.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        A trigger earns a dot when it shows up on at least two entries. Two dots get a line when
        some entry carries them both. The thicker the line, the more entries make that trip.
      </p>

      <div className="border-line bg-elevated text-muted mt-6 inline-flex rounded-lg border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase">
        {nodes.length} triggers · {graph.edges.length} links
      </div>

      <div className="mt-10">
        <RelationshipMap nodes={nodes} edges={graph.edges} />
      </div>

      <div className="mt-16">
        <div className="border-line mb-6 flex items-baseline justify-between gap-3 border-b pb-3">
          <h2 className="text-ink text-2xl font-semibold tracking-tight">Strongest pairs</h2>
          <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
            shared entries
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {pairs.map((pair) => (
            <li
              key={`${pair.a}-${pair.b}`}
              className="border-line bg-surface rounded-2xl border px-4 py-3"
            >
              <span className="text-ink font-medium">{pair.a}</span>
              <span className="text-muted mx-2" aria-hidden="true">
                +
              </span>
              <span className="text-ink font-medium">{pair.b}</span>
              <span className="text-muted ml-2 font-mono text-sm tabular-nums">{pair.weight}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-muted mt-12 text-sm">
        Prefer a flat list? Search the{' '}
        <Link href="/skills" className="text-ink underline underline-offset-4">
          registry
        </Link>{' '}
        by trigger, or read the{' '}
        <Link href="/glossary" className="text-ink underline underline-offset-4">
          glossary
        </Link>{' '}
        for what each word means.
      </p>
    </section>
  )
}
