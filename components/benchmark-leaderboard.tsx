'use client'

import { useDeferredValue, useMemo, useState, useTransition } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CaretDown, CaretUp, Flask, MagnifyingGlass, X } from '@phosphor-icons/react'
import { EASE } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { CountUp } from '@/components/count-up'
import {
  SORT_OPTIONS,
  filterByTrack,
  formatCost,
  formatDelta,
  formatLatency,
  formatScore,
  rankEntries,
  searchEntries,
  sortEntries,
  summarize,
  type BenchmarkEntry,
  type SortKey,
  type TrackFilter,
} from '@/lib/benchmarks'

const TRACKS: { value: TrackFilter; label: string }[] = [
  { value: 'llm', label: 'Models' },
  { value: 'agent', label: 'Harnesses' },
  { value: 'all', label: 'All runs' },
]

interface LeaderboardProps {
  entries: BenchmarkEntry[]
}

/**
 * The benchmark console: track filter, search, sort, and a ranked table.
 *
 * Motion is motivated and bounded. Bars animate once on first view with a
 * scaleX transform (never width) and collapse to their final state under
 * `prefers-reduced-motion`. Row disclosure animates height only when motion
 * is allowed. Every control has a real pending state via useDeferredValue
 * plus useTransition, so the list never lies about what it is showing.
 */
export function BenchmarkLeaderboard({ entries }: LeaderboardProps) {
  const reduce = useReducedMotion()
  const [track, setTrack] = useState<TrackFilter>('llm')
  const [sort, setSort] = useState<SortKey>('score')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isRouting, startRouteTransition] = useTransition()

  const deferredQuery = useDeferredValue(query)
  const isStale = deferredQuery !== query || isRouting

  const rows = useMemo(() => {
    const filtered = searchEntries(filterByTrack(entries, track), deferredQuery)
    return rankEntries(sortEntries(filtered, sort))
  }, [entries, track, deferredQuery, sort])

  const stats = useMemo(() => summarize(filterByTrack(entries, track)), [entries, track])

  function selectTrack(value: TrackFilter) {
    startRouteTransition(() => {
      setTrack(value)
      setExpanded(null)
    })
  }

  function selectSort(value: SortKey) {
    startRouteTransition(() => setSort(value))
  }

  return (
    <div className="border-line bg-surface overflow-hidden rounded-2xl border shadow-[0_24px_80px_-40px_rgba(0,0,0,0.4)]">
      {/* Console chrome */}
      <div className="border-line flex items-center gap-3 border-b px-4 py-3 sm:px-5">
        <span className="mono-label">bench --track {track}</span>
        <span className="mono-label border-line ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
          <Flask weight="regular" className="h-3.5 w-3.5" />
          sample dataset
        </span>
      </div>

      {/* Summary scoreboard */}
      <div className="divide-line border-line grid grid-cols-3 divide-x border-b">
        <SummaryCell label="best" value={stats.best} track={track} suffix="" />
        <SummaryCell label="median" value={stats.median} track={track} suffix="" />
        <SummaryCell label="runs" value={stats.runs} track={track} suffix="" decimals={0} />
      </div>

      {/* Toolbar */}
      <div className="border-line flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
        <div
          role="group"
          aria-label="Benchmark track"
          className="border-line bg-bg flex gap-1 rounded-full border p-1"
        >
          {TRACKS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={track === option.value}
              onClick={() => selectTrack(option.value)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200',
                track === option.value ? 'bg-accent text-on-accent' : 'text-muted hover:text-ink',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <MagnifyingGlass
            weight="regular"
            className="text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Filter by model, harness, or suite"
            aria-label="Filter benchmark runs"
            className="border-line bg-bg text-ink placeholder:text-muted focus-visible:border-accent h-9 w-full rounded-full border pr-8 pl-9 text-sm outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="text-muted hover:text-ink absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
            >
              <X weight="regular" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <label className="flex items-center gap-2">
          <span className="mono-label">Sort</span>
          <select
            value={sort}
            onChange={(event) => selectSort(event.target.value as SortKey)}
            className="border-line bg-bg text-ink focus-visible:border-accent h-9 rounded-full border px-2.5 text-sm outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Rows */}
      <div
        className={cn('transition-opacity duration-200', isStale && 'opacity-60')}
        aria-busy={isStale}
      >
        <p className="sr-only" role="status">
          {rows.length} runs shown, sorted by {SORT_OPTIONS.find((o) => o.key === sort)?.label}
        </p>

        {entries.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-ink text-base font-medium">No runs in this dataset.</p>
            <p className="text-muted mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed">
              The benchmark module is empty. Add entries to content/benchmarks.ts to populate the
              scoreboard.
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-ink text-base font-medium">No runs match that filter.</p>
            <p className="text-muted mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed">
              Try a suite name like SWE-bench, a lab like Anthropic, or clear the filter to see
              every run.
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="border-line text-ink hover:border-ink/30 mt-6 inline-flex h-10 items-center rounded-full border px-5 text-sm font-medium transition-colors active:scale-[0.98]"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <ul className="divide-line divide-y">
            {rows.map((entry, index) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                index={index}
                reduce={!!reduce}
                open={expanded === entry.id}
                onToggle={() => setExpanded((current) => (current === entry.id ? null : entry.id))}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Console footer */}
      <div className="border-line flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 sm:px-5">
        <span className="mono-label">
          {rows.length} of {entries.length} runs shown
        </span>
        <span className="mono-label">scores are 0-100, higher is better, ties share a rank</span>
      </div>
    </div>
  )
}

/**
 * A score bar with no background track: the fill is the whole signal.
 *
 * The animated branch scales on the compositor (`scaleX`, never `width`) and
 * runs once when the row scrolls into view. The reduced-motion branch renders a
 * plain, untransformed span, so there is no transform left for a later
 * preference change to strand at zero width.
 */
function ScoreBar({ score, index, reduce }: { score: number; index: number; reduce: boolean }) {
  const style = { width: `${score}%` }

  if (reduce) return <span style={style} className="bg-accent block h-1.5 rounded-full" />

  return (
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [...EASE], delay: Math.min(index * 0.05, 0.4) }}
      style={{ ...style, transformOrigin: 'left center' }}
      className="bg-accent block h-1.5 rounded-full"
    />
  )
}

function SummaryCell({
  label,
  value,
  track,
  decimals = 1,
  suffix,
}: {
  label: string
  value: number
  track: TrackFilter
  decimals?: number
  suffix: string
}) {
  return (
    <div className="px-4 py-4 sm:px-5">
      <p className="text-ink font-mono text-2xl tracking-tighter sm:text-3xl">
        <CountUp key={`${track}-${label}`} value={value} decimals={decimals} suffix={suffix} />
      </p>
      <p className="mono-label mt-1">{label}</p>
    </div>
  )
}

function LeaderboardRow({
  entry,
  index,
  reduce,
  open,
  onToggle,
}: {
  entry: BenchmarkEntry & { rank: number }
  index: number
  reduce: boolean
  open: boolean
  onToggle: () => void
}) {
  const panelId = `bench-panel-${entry.id}`
  const podium = entry.rank <= 3

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="hover:bg-elevated/60 grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-3 px-4 py-4 text-left transition-colors duration-200 sm:gap-4 sm:px-5"
      >
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold',
            entry.rank === 1 && 'bg-accent text-on-accent',
            entry.rank > 1 && podium && 'border-line bg-elevated text-ink border',
            !podium && 'text-muted',
          )}
        >
          {entry.rank}
        </span>

        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-ink font-medium tracking-tight">{entry.name}</span>
            <span className="border-line text-muted rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase">
              {entry.org}
            </span>
          </span>
        </span>

        <span className="flex items-center gap-3 sm:gap-5">
          <span className="text-ink font-mono text-lg tracking-tighter sm:text-xl">
            {formatScore(entry.score)}
          </span>
          <span
            className={cn(
              'hidden items-center gap-0.5 font-mono text-xs sm:inline-flex',
              entry.delta > 0 ? 'text-accent' : 'text-muted',
            )}
          >
            {entry.delta > 0 ? (
              <CaretUp weight="fill" className="h-3 w-3" aria-hidden="true" />
            ) : entry.delta < 0 ? (
              <CaretDown weight="fill" className="h-3 w-3" aria-hidden="true" />
            ) : null}
            {formatDelta(entry.delta)}
          </span>
          <CaretDown
            weight="regular"
            className={cn(
              'text-muted h-4 w-4 shrink-0 transition-transform duration-200',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Trackless bar: transform-only animation, no background track. */}
      <div className="px-4 pb-4 sm:px-5">
        <div className="pl-0 sm:pl-[3.25rem]">
          <ScoreBar score={entry.score} index={index} reduce={reduce} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [...EASE] }}
            className="bg-bg overflow-hidden"
          >
            <div className="grid gap-5 px-4 py-5 sm:grid-cols-[1.4fr_1fr] sm:gap-8 sm:px-5 sm:pl-[3.25rem]">
              <dl className="space-y-2.5">
                {entry.breakdown.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <dt className="text-muted w-[38%] shrink-0 text-xs">{item.label}</dt>
                    <dd className="flex flex-1 items-center gap-3">
                      <span
                        className="bg-accent block h-1 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                      <span className="text-ink font-mono text-xs">{formatScore(item.score)}</span>
                    </dd>
                  </div>
                ))}
              </dl>

              <dl className="border-line grid grid-cols-3 gap-4 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
                <div>
                  <dt className="mono-label">latency</dt>
                  <dd className="text-ink mt-1 font-mono text-sm">
                    {formatLatency(entry.latency)}
                  </dd>
                </div>
                <div>
                  <dt className="mono-label">cost</dt>
                  <dd className="text-ink mt-1 font-mono text-sm">{formatCost(entry.cost)}</dd>
                </div>
                <div>
                  <dt className="mono-label">updated</dt>
                  <dd className="text-ink mt-1 font-mono text-sm">{entry.updatedAt}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
