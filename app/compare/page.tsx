import type { Metadata } from 'next'
import { CompareBoard, ComparePresets } from '@/components/compare-board'
import { getEntries } from '@/lib/registry'
import { COMPARE_LIMIT } from '@/lib/compare'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Compare entries',
  description:
    'Put any two to four registry entries side by side: kind, craft, command, licence, and source. A real URL you can share.',
}

export default function ComparePage() {
  const catalog = getEntries()
  const featured = catalog.filter((entry) => entry.featured).slice(0, 4)

  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">Compare</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Two entries, side by side.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        Pick up to {COMPARE_LIMIT} entries from the {catalog.length}-row registry and compare the
        fields that are actually recorded: kind, craft, command, licence, source, and when the entry
        was added. Nothing is scored, because a registry entry has no honest score.
      </p>

      <CompareBoard />

      {featured.length >= 2 && <ComparePresets slugs={featured.map((entry) => entry.slug)} />}
    </section>
  )
}
