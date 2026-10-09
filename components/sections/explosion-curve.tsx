import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/ssr'
import { curves } from '@/content/curves'
import { MiniChart } from '@/components/mini-chart'

/**
 * The intelligence-explosion track, shown as measurement rather than
 * prophecy. Two published curves, the source under each one, and the
 * contest around them stated in the copy instead of buried.
 */
export function ExplosionCurve() {
  const [first, second] = curves

  return (
    <section
      id="explosion"
      className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32"
    >
      <div className="max-w-[65ch]">
        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          How fast is the loop closing?
        </h2>
        <p className="text-muted mt-5 text-lg leading-relaxed">
          Two published curves, plotted from their own waypoints. Both come from one source and both
          are contested, so read them as measurements, not forecasts.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
        {[first, second].map((series) => (
          <figure
            key={series.id}
            className="border-line bg-surface m-0 rounded-2xl border p-5 lg:p-6"
          >
            <h3 className="max-w-[34ch] text-base leading-snug font-semibold tracking-tight">
              {series.title}
            </h3>

            <div className="mt-5">
              <MiniChart series={series} />
            </div>

            <figcaption className="border-line mt-4 border-t pt-4">
              <p className="text-muted max-w-[52ch] text-sm leading-relaxed">{series.caption}</p>
              <p className="mono-label mt-3">
                y axis in {series.unit} ·{' '}
                <a
                  href={series.source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent inline-flex items-center gap-1 transition-colors hover:brightness-110"
                >
                  {series.source.label}
                  <ArrowUpRight weight="regular" className="h-3 w-3" />
                </a>
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 max-w-[65ch]">
        <p className="text-muted text-lg leading-relaxed">
          Each figure in the log below carries the limit of its claim next to it, because a curve
          without a caveat is a press release.
        </p>
      </div>
    </section>
  )
}
