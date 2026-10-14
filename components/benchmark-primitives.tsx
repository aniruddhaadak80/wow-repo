import type { ReactNode } from 'react'
import type { Breakdown } from '@/content/benchmarks'
import type { BenchmarkEntry } from '@/lib/benchmarks'
import { efficiency, formatCost, formatScore } from '@/lib/benchmarks'
import { cn } from '@/lib/cn'

/**
 * Comparison visuals never draw a background track: the fill is the whole
 * signal. Widths come from `scaleX` transforms only when animated, so the
 * compositor does the work and reduced motion can render the final state.
 */
export function Meter({
  value,
  max = 100,
  label,
  className,
}: {
  value: number
  max?: number
  label: string
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div
      role="img"
      aria-label={`${label}: ${formatScore(value)}`}
      className={cn('bg-accent block h-1.5 rounded-full', className)}
      style={{ width: `${pct}%` }}
    />
  )
}

export function SuiteTable({ suites }: { suites: Breakdown[] }) {
  return (
    <dl className="space-y-4">
      {suites.map((suite) => (
        <div key={suite.label}>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted text-sm">{suite.label}</dt>
            <dd className="text-ink font-mono text-sm">{formatScore(suite.score)}</dd>
          </div>
          <Meter value={suite.score} label={suite.label} className="mt-2" />
        </div>
      ))}
    </dl>
  )
}

export function StatTile({
  label,
  value,
  hint,
  children,
}: {
  label: string
  value: ReactNode
  hint?: string
  children?: ReactNode
}) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-5">
      <p className="mono-label">{label}</p>
      <p className="text-ink mt-2 font-mono text-2xl tracking-tighter">{value}</p>
      {hint && <p className="text-muted mt-1 text-xs leading-relaxed">{hint}</p>}
      {children}
    </div>
  )
}

/** Score per cent spent, the number a cost-conscious reader wants first. */
export function Efficiency({ entry }: { entry: BenchmarkEntry }) {
  const value = efficiency(entry)
  return (
    <StatTile
      label="score per cent"
      value={Number.isFinite(value) ? value.toFixed(1) : 'free'}
      hint={`${formatScore(entry.score)} composite at ${formatCost(entry.cost)} per task`}
    />
  )
}
