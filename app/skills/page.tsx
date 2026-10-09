import { SkillsExplorer } from '@/components/skills-explorer'
import { KINDS, KIND_META, getRegistryCounts } from '@/lib/registry'

export const revalidate = 3600

export const metadata = {
  title: 'The registry',
  description:
    'Skills, MCP servers, public APIs, protocols, harnesses, and free software: the whole open agent stack in one searchable registry.',
}

export default function SkillsPage() {
  const counts = getRegistryCounts()

  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">The registry</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        The open agent stack, in full.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {counts.total} entries across {KINDS.length} kinds and {counts.crafts} crafts. Each one
        carries a real command, a real source, and the craft it belongs to.
      </p>

      <SkillsExplorer />

      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KINDS.map((kind) => (
          <div key={kind} className="border-line bg-surface rounded-2xl border p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-ink font-medium tracking-tight">{KIND_META[kind].label}</h2>
              <span className="text-accent font-mono text-2xl tracking-tighter">
                {counts.byKind[kind]}
              </span>
            </div>
            <p className="text-muted mt-2 text-sm leading-relaxed">{KIND_META[kind].blurb}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
