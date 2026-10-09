import type { ChartSeries } from '@/content/curves'

const W = 520
const H = 250
const PAD = { top: 26, right: 22, bottom: 46, left: 70 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

/**
 * A small, honest line chart. No client JavaScript, no charting library.
 *
 * Deliberately limited on purpose: it draws published waypoints and the
 * straight segments between them. No smoothing, no interpolation, no
 * extrapolation, because smoothing a signal this contested would be a claim.
 *
 * The line draws itself as the chart scrolls into view using CSS
 * scroll-driven animations. Where `animation-timeline: view()` is
 * unsupported, the full line renders immediately.
 */
export function MiniChart({ series }: { series: ChartSeries }) {
  const { points, yTicks, scale, domain, reference } = series

  const normalise = (value: number) => {
    if (scale === 'log') {
      const lo = Math.log10(domain[0])
      const hi = Math.log10(domain[1])
      return (Math.log10(value) - lo) / (hi - lo)
    }
    return (value - domain[0]) / (domain[1] - domain[0])
  }

  const x = (index: number) =>
    PAD.left + (points.length === 1 ? PLOT_W / 2 : (index / (points.length - 1)) * PLOT_W)
  const y = (value: number) => PAD.top + (1 - normalise(value)) * PLOT_H

  const linePath = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(point.value)}`)
    .join(' ')

  const description = points
    .map((point) => `${point.label}: ${point.display}${point.note ? ` (${point.note})` : ''}`)
    .join(', ')

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-labelledby={`${series.id}-title ${series.id}-desc`}
    >
      <title id={`${series.id}-title`}>{series.title}</title>
      <desc id={`${series.id}-desc`}>
        {`${series.title} ${description}. Y axis in ${series.unit}.`}
      </desc>

      {/* Horizontal reference line, drawn first so data sits above it. */}
      {reference && (
        <g>
          <line
            x1={PAD.left}
            x2={PAD.left + PLOT_W}
            y1={y(reference.value)}
            y2={y(reference.value)}
            className="stroke-line"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <text
            x={PAD.left + PLOT_W}
            y={y(reference.value) - 7}
            textAnchor="end"
            className="chart-axis-label"
          >
            {reference.label}
          </text>
        </g>
      )}

      {/* Gridlines and y-axis ticks. */}
      {yTicks.map((tick) => (
        <g key={tick.label}>
          <line
            x1={PAD.left}
            x2={PAD.left + PLOT_W}
            y1={y(tick.value)}
            y2={y(tick.value)}
            className="stroke-line"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 12}
            y={y(tick.value) + 3.5}
            textAnchor="end"
            className="chart-axis-label"
          >
            {tick.label}
          </text>
        </g>
      ))}

      {/* The series. */}
      <path
        d={linePath}
        className="chart-line"
        pathLength={1}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points and their labels. */}
      {points.map((point, i) => (
        <g key={point.label} className="chart-point">
          <circle cx={x(i)} cy={y(point.value)} r={4.5} className="fill-accent" />
          <circle cx={x(i)} cy={y(point.value)} r={8} className="fill-accent opacity-15" />
          <text
            x={x(i)}
            y={y(point.value) - 15}
            textAnchor="middle"
            className="chart-value-label fill-ink"
          >
            {point.display}
          </text>
          <text x={x(i)} y={PAD.top + PLOT_H + 20} textAnchor="middle" className="chart-axis-label">
            {point.label}
          </text>
          {point.note && (
            <text
              x={x(i)}
              y={PAD.top + PLOT_H + 34}
              textAnchor="middle"
              className="chart-axis-label"
            >
              {point.note}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
