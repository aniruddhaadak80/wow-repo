import { SwarmRunner } from '@/components/swarm-runner'

export function Swarms() {
  return (
    <section id="swarms" className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32">
      <div className="max-w-[65ch]">
        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">One task, many agents.</h2>
        <p className="text-muted mt-5 text-lg leading-relaxed">
          A swarm is one lead agent and a small cast of specialists. The lead keeps the brief,
          splits the work, and merges the reports. The panel below runs that loop for real, on the
          skills in this catalog.
        </p>
      </div>

      <div className="mt-12">
        <SwarmRunner />
      </div>
    </section>
  )
}
