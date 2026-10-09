import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/ssr'
import { automatedRunbooks, departments, totalAgents, totalRunbooks } from '@/content/company'

/** A real panel reading the demo org, not a screenshot. */
function OrgSnapshot() {
  const coverage = Math.round((automatedRunbooks / totalRunbooks) * 100)

  return (
    <div className="border-line bg-surface rounded-2xl border p-7 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] lg:p-8">
      <p className="mono-label">Org snapshot</p>
      <p className="mono-label mt-1">Sample org. Coverage is a design target, not telemetry.</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7">
        <div>
          <dt className="mono-label">agents</dt>
          <dd className="text-ink mt-1 font-mono text-4xl tracking-tighter">{totalAgents}</dd>
        </div>
        <div>
          <dt className="mono-label">departments</dt>
          <dd className="text-ink mt-1 font-mono text-4xl tracking-tighter">
            {departments.length}
          </dd>
        </div>
        <div className="border-line col-span-2 border-t pt-6">
          <dt className="mono-label">runbooks automated</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className="text-ink font-mono text-4xl tracking-tighter">
              {automatedRunbooks}
            </span>
            <span className="text-muted font-mono text-sm">/ {totalRunbooks}</span>
            <span className="text-accent ml-auto font-mono text-sm">{coverage}%</span>
          </dd>
        </div>
      </dl>

      <ul className="border-line mt-7 space-y-2.5 border-t pt-6">
        {departments.slice(0, 4).map((dept) => (
          <li key={dept.id} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted">{dept.name}</span>
            <span className="text-ink font-mono text-xs">
              {dept.agents.length} agent{dept.agents.length === 1 ? '' : 's'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AgentsHero() {
  return (
    <section className="container-x grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
      <div>
        <p className="eyebrow">Agentic automation</p>
        <h1 className="mt-6 text-5xl leading-[1.04] font-bold tracking-tighter sm:text-6xl">
          Every runbook in the company, already <em className="text-accent italic">running</em>.
        </h1>
        <p className="text-muted mt-6 max-w-[52ch] text-lg leading-relaxed">
          Twenty-four agents across eight departments. Each one runs a real runbook, records what it
          did, and stops at the human gate.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#run"
            className="bg-accent text-on-accent flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            See a run
            <ArrowRight weight="regular" className="h-4 w-4" />
          </a>
          <a
            href="#org"
            className="border-line text-ink hover:border-ink/30 flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors duration-200"
          >
            Open the org map
          </a>
        </div>
      </div>

      <div>
        <OrgSnapshot />
      </div>
    </section>
  )
}
