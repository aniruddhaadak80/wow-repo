import { BenchmarkLeaderboard } from '@/components/benchmark-leaderboard'
import { getBenchmarkEntries } from '@/lib/benchmarks'

export function Benchmarks() {
  const entries = getBenchmarkEntries()

  return (
    <section
      id="benchmarks"
      className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32"
    >
      <h2 className="max-w-[24ch] text-4xl font-bold tracking-tighter sm:text-5xl">
        Benchmarks that don&rsquo;t flatter themselves.
      </h2>
      <p className="text-muted mt-5 max-w-[62ch] text-lg leading-relaxed">
        Two tracks, fourteen runs, one scoreboard. The numbers below are sample data shaped like
        harness output; the code that reads them is real.
      </p>

      <div className="mt-12">
        <BenchmarkLeaderboard entries={entries} />
      </div>
    </section>
  )
}
