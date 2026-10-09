import { SuperintelligenceExplorer } from '@/components/superintelligence-explorer'
import { KINDS, TOPICS } from '@/lib/superintelligence'
import { getAfterEntries } from '@/lib/superintelligence'

export const revalidate = 3600

export const metadata = {
  title: 'After the world',
  description:
    'Scenarios, papers, books, quotes, and researchers: the superintelligence debate as a sourced collection, every claim linked.',
}

export default function SuperintelligencePage() {
  const entries = getAfterEntries()

  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">After the world</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Superintelligence, sourced.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {entries.length} entries across {KINDS.length} kinds and {TOPICS.length} topics. Scenarios
        for what comes next, papers and books behind the worry, the sentences everyone quotes, and
        the researchers who wrote them.
      </p>

      <SuperintelligenceExplorer entries={entries} />
    </section>
  )
}
