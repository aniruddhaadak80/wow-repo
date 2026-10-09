/*
 * The measured curves behind the intelligence-explosion track.
 *
 * Every point here is a published waypoint with a date and a source. Nothing
 * is interpolated, smoothed, or extrapolated: the straight segments between
 * points connect published values only, and the chart caption says so.
 *
 * Do not add a point you cannot cite. A shorter honest line beats a longer
 * invented one.
 */

export interface ChartPoint {
  /** Axis label under the point. */
  label: string
  /** Numeric value, in the unit declared by the series. */
  value: number
  /** How the value reads to a human. */
  display: string
  /** Which system produced it, when a source names one. */
  note?: string
}

export interface ChartSeries {
  id: string
  /** Question the chart answers. Written as a question on purpose. */
  title: string
  /** Y-axis unit, shown in the caption so tick labels stay short. */
  unit: string
  scale: 'linear' | 'log'
  /** Domain in the scale's own space. */
  domain: [number, number]
  yTicks: { value: number; label: string }[]
  points: ChartPoint[]
  /** Optional horizontal reference line with a plain-language meaning. */
  reference?: { value: number; label: string }
  caption: string
  source: { label: string; url: string }
}

export const curves: ChartSeries[] = [
  {
    id: 'task-horizon',
    title: 'How long a task can an agent finish on its own?',
    unit: 'minutes, log scale',
    scale: 'log',
    domain: [1, 1000],
    yTicks: [
      { value: 1, label: '1 min' },
      { value: 10, label: '10 min' },
      { value: 100, label: '100 min' },
      { value: 1000, label: '1000 min' },
    ],
    points: [
      { label: 'Mar 2024', value: 4, display: '4 min', note: 'Claude Opus 3' },
      { label: 'Mar 2025', value: 90, display: '90 min', note: 'Claude Sonnet 3.7' },
      { label: 'Mar 2026', value: 720, display: '12 hours', note: 'Claude Opus 4.6' },
    ],
    caption:
      'Straight segments connect published waypoints only. The doubling time across the whole span is roughly four months.',
    source: {
      label: 'METR time horizons, as reported by the Anthropic Institute',
      url: 'https://metr.org/time-horizons/',
    },
  },
  {
    id: 'next-step-judgement',
    title: 'How often does a model pick the better research next step?',
    unit: 'percent of 129 real research detours',
    scale: 'linear',
    domain: [0, 100],
    yTicks: [
      { value: 0, label: '0%' },
      { value: 50, label: '50%' },
      { value: 100, label: '100%' },
    ],
    points: [
      { label: 'Nov 2025', value: 51, display: '51%', note: 'Claude Opus 4.5' },
      { label: 'Apr 2026', value: 64, display: '64%', note: 'Claude Mythos Preview' },
    ],
    reference: { value: 50, label: 'human parity' },
    caption:
      'Judged on moments where a researcher went off course before recovering, so the comparison is against a human choice that had room to improve, not against an average one.',
    source: {
      label: 'The Anthropic Institute, When AI builds itself',
      url: 'https://www.anthropic.com/institute/recursive-self-improvement',
    },
  },
]
