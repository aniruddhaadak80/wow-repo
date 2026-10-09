import { FindingsExplorer } from '@/components/findings-explorer'
import { ExplosionCurve } from '@/components/sections/explosion-curve'
import { getFindings, sortFindingsByDate } from '@/lib/findings'

export const revalidate = 3600

export const metadata = {
  title: 'The frontier log',
  description:
    'A sourced log of scientific discoveries and the published evidence on how fast machine research is compounding.',
}

export default function DiscoveriesPage() {
  const findings = sortFindingsByDate(getFindings())

  return (
    <>
      <section className="container-x py-20 lg:py-24">
        <p className="eyebrow">The frontier log</p>
        <h1 className="mt-5 max-w-[22ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
          Discoveries, and the speed they are arriving at.
        </h1>
        <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
          Every entry links to the source it came from and states the limit of the claim. Filter by
          track to separate what science found from how fast machine research is compounding.
        </p>

        <FindingsExplorer findings={findings} />
      </section>

      <ExplosionCurve />
    </>
  )
}
