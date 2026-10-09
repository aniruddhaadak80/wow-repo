import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/ssr'
import { departments, totalAgents } from '@/content/company'

/**
 * The bridge from the skills catalog to the automation map.
 * A stacked headline plus a dense index strip, which no other
 * section on the page uses.
 */
export function CompanyBand() {
  return (
    <section className="container-x border-line border-t py-20 lg:py-24">
      <h2 className="max-w-[26ch] text-4xl font-bold tracking-tighter sm:text-5xl">
        The company it automates.
      </h2>
      <p className="text-muted mt-5 max-w-[58ch] text-lg leading-relaxed">
        {totalAgents} agents across eight departments in the demo org, driven by the skills in the
        catalog above.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 xl:grid-cols-8">
        {departments.map((dept) => (
          <div key={dept.id} className="border-line border-t pt-4">
            <p className="text-ink text-sm font-medium">{dept.name}</p>
            <p className="mono-label mt-1">
              {dept.agents.length} agent{dept.agents.length === 1 ? '' : 's'}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/agents"
        className="text-accent mt-10 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
      >
        Open the org map
        <ArrowRight weight="regular" className="h-4 w-4" />
      </Link>
    </section>
  )
}
