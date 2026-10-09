import { agentActs, demoRun, humanDecides } from '@/content/company'
import { OrchestrationReplay } from '@/components/orchestration-replay'

export function RunReplay() {
  return (
    <section id="run" className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32">
      <h2 className="max-w-[24ch] text-4xl font-bold tracking-tighter sm:text-5xl">
        Watch one run, end to end.
      </h2>
      <p className="text-muted mt-5 max-w-[62ch] text-lg leading-relaxed">
        Six agents, one ticket, no human in the middle. Play it, pause it, or jump to any step.
      </p>

      <div className="mt-14">
        <OrchestrationReplay run={demoRun} />
      </div>

      <p className="mono-label border-line mt-10 border-t pt-6">
        Demo run. Sample timings, not benchmarks.
      </p>
    </section>
  )
}

export function Guardrails() {
  return (
    <section
      id="guardrails"
      className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32"
    >
      <h2 className="max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl">
        Where agents stop.
      </h2>
      <p className="text-muted mt-5 max-w-[58ch] text-lg leading-relaxed">
        Automation earns trust by drawing the line in the right place. Two lists, kept short on
        purpose.
      </p>

      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="border-line border-t pt-6">
          <h3 className="text-xl font-semibold tracking-tight">An agent can</h3>
          <ul className="mt-5 space-y-4">
            {agentActs.map((item) => (
              <li key={item} className="text-muted max-w-[46ch] leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-line border-t pt-6">
          <h3 className="text-xl font-semibold tracking-tight">A person decides</h3>
          <ul className="mt-5 space-y-4">
            {humanDecides.map((item) => (
              <li key={item} className="text-muted max-w-[46ch] leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
