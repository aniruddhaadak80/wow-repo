'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { FIELDS, TRACKS, type Field, type Finding, type Track } from '@/content/findings'
import { formatFindingDate, sortFindingsByDate } from '@/lib/findings'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

type TrackFilter = 'All' | Track
type FieldFilter = 'All' | Field

const TRACK_LABELS: Record<Track, string> = {
  discovery: 'Discoveries',
  signal: 'Signals',
}

export function FindingsExplorer({ findings }: { findings: Finding[] }) {
  const [query, setQuery] = useState('')
  const [track, setTrack] = useState<TrackFilter>('All')
  const [field, setField] = useState<FieldFilter>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sortFindingsByDate(
      findings.filter((finding) => {
        if (track !== 'All' && finding.track !== track) return false
        if (field !== 'All' && finding.field !== field) return false
        if (!q) return true
        return (
          finding.title.toLowerCase().includes(q) ||
          finding.summary.toLowerCase().includes(q) ||
          finding.detail.toLowerCase().includes(q) ||
          finding.org.toLowerCase().includes(q) ||
          finding.source.label.toLowerCase().includes(q)
        )
      }),
    )
  }, [findings, query, track, field])

  const reset = () => {
    setQuery('')
    setTrack('All')
    setField('All')
  }

  return (
    <div>
      <div className="mt-10 flex flex-col gap-3">
        <div className="relative">
          <MagnifyingGlass
            weight="regular"
            className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by field, institution, or source"
            className="border-line bg-surface text-ink placeholder:text-muted focus:border-accent h-11 w-full rounded-full border pr-10 pl-11 text-sm transition-colors outline-none"
            aria-label="Search the frontier log"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted hover:text-ink absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X weight="regular" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by track">
          {(['All', ...TRACKS] as TrackFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={track === option}
              onClick={() => setTrack(option)}
              className={cn(
                'h-9 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                track === option
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
              )}
            >
              {option === 'All' ? 'Everything' : TRACK_LABELS[option]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by field">
          {(['All', ...FIELDS] as FieldFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={field === option}
              onClick={() => setField(option)}
              className={cn(
                'h-8 rounded-full border px-3.5 font-mono text-xs transition-all duration-200 active:scale-[0.98]',
                field === option
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
              )}
            >
              {option === 'All' ? 'All fields' : option}
            </button>
          ))}
        </div>
      </div>

      <p className="mono-label mt-8" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        {track !== 'All' ? `, ${TRACK_LABELS[track].toLowerCase()}` : ''}
        {field !== 'All' ? `, ${field}` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="border-line mt-6 rounded-2xl border border-dashed py-20 text-center">
          <p className="text-ink text-lg font-medium">Nothing matches &ldquo;{query}&rdquo;.</p>
          <p className="text-muted mt-2 text-sm">
            Try a field like &ldquo;Space&rdquo;, or an institution like &ldquo;METR&rdquo;.
          </p>
          <button
            type="button"
            onClick={reset}
            className="border-line text-ink hover:border-ink/30 mt-6 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <motion.div layout className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((finding) => (
              <motion.div
                layout
                key={finding.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [...EASE] }}
                className="h-full"
              >
                <FindingCard finding={finding} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <article className="border-line bg-surface hover:border-ink/25 flex h-full flex-col rounded-2xl border p-6 transition-colors lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="mono-label text-accent">{finding.field}</span>
        <span className="mono-label">{formatFindingDate(finding.date)}</span>
      </div>

      <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight">
        <Link href={`/discoveries/${finding.slug}`} className="transition-opacity hover:opacity-75">
          {finding.title}
        </Link>
      </h3>

      <p className="text-muted mt-3 max-w-[60ch] leading-relaxed">{finding.summary}</p>

      {finding.figure && (
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-ink font-mono text-2xl tracking-tighter">
            {finding.figure.value}
          </span>
          <span className="text-muted max-w-[30ch] text-sm">{finding.figure.label}</span>
        </div>
      )}

      {finding.caveat && (
        <p className="border-line text-muted mt-5 border-t pt-4 text-sm leading-relaxed">
          <span className="text-ink font-medium">Limit: </span>
          {finding.caveat}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        <span className="mono-label max-w-[28ch] leading-relaxed">{finding.org}</span>
        <a
          href={finding.source.url}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent text-sm font-medium transition-colors hover:brightness-110"
        >
          Source
        </a>
      </div>
    </article>
  )
}
