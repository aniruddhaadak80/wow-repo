import { departments, totalAgents, totalRunbooks, automatedRunbooks } from '@/content/company'
import { getEntryBySlug } from '@/lib/registry'

/**
 * The squad board. Eight departments, one dense index rather than
 * eight cards. Hairlines separate columns; no card containers.
 */
export function OrgMap() {
  return (
    <section id="org" className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="max-w-[22ch] text-4xl font-bold tracking-tighter sm:text-5xl">
          Eight departments. One roster.
        </h2>
        <p className="mono-label">Demo roster. Coverage is a design target.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
        {departments.map((dept) => {
          const skillSlugs = [...new Set(dept.agents.flatMap((agent) => agent.skills))]
          return (
            <article key={dept.id} className="border-line border-t pt-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-ink font-mono text-4xl tracking-tighter">
                  {String(dept.agents.length).padStart(2, '0')}
                </p>
                <p className="text-muted font-mono text-xs">
                  <span className="text-accent">{dept.automated}</span>/{dept.runbooks}
                </p>
              </div>

              <h3 className="mt-3 text-lg font-semibold tracking-tight">{dept.name}</h3>
              <p className="text-muted mt-1.5 max-w-[30ch] text-sm leading-relaxed">
                {dept.summary}
              </p>

              <ul className="mt-5 space-y-3">
                {dept.agents.map((agent) => (
                  <li key={agent.id}>
                    <p className="text-accent font-mono text-xs">{agent.label}</p>
                    <p className="text-muted mt-1 text-sm leading-relaxed">{agent.does}</p>
                  </li>
                ))}
              </ul>

              {skillSlugs.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {skillSlugs.map((slug) => (
                    <span
                      key={slug}
                      className="border-line bg-elevated text-muted rounded-lg border px-2 py-0.5 font-mono text-[10px]"
                    >
                      {getEntryBySlug(slug)?.name ?? slug}
                    </span>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <dl className="border-line mt-14 grid grid-cols-2 gap-y-8 border-t pt-8 sm:grid-cols-4">
        {[
          { label: 'agents deployed', value: totalAgents },
          { label: 'departments covered', value: departments.length },
          { label: 'runbooks owned', value: totalRunbooks },
          { label: 'runbooks automated', value: automatedRunbooks },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="mono-label">{stat.label}</dt>
            <dd className="text-ink mt-1.5 font-mono text-3xl tracking-tighter">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
