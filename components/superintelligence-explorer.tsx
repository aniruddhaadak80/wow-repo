'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import {
  KINDS,
  KIND_META,
  TOPICS,
  type AfterEntry,
  type Kind,
  type Topic,
} from '@/content/superintelligence'
import { formatAfterDate, sortAfterByDate } from '@/lib/superintelligence'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

type KindFilter = 'All' | Kind
type TopicFilter = 'All' | Topic

export function SuperintelligenceExplorer({ entries }: { entries: AfterEntry[] }) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('All')
  const [topic, setTopic] = useState<TopicFilter>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sortAfterByDate(
      entries.filter((entry) => {
        if (kind !== 'All' && entry.kind !== kind) return false
        if (topic !== 'All' && entry.topic !== topic) return false
        if (!q) return true
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.summary.toLowerCase().includes(q) ||
          entry.detail.toLowerCase().includes(q) ||
          entry.org.toLowerCase().includes(q) ||
          entry.source.label.toLowerCase().includes(q)
        )
      }),
    )
  }, [entries, query, kind, topic])

  const reset = () => {
    setQuery('')
    setKind('All')
    setTopic('All')
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
            placeholder="Search by topic, voice, or source"
            className="border-line bg-surface text-ink placeholder:text-muted focus:border-accent h-11 w-full rounded-full border pr-10 pl-11 text-sm transition-colors outline-none"
            aria-label="Search the collection"
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

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
          {(['All', ...KINDS] as KindFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={kind === option}
              onClick={() => setKind(option)}
              className={cn(
                'h-9 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                kind === option
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
              )}
            >
              {option === 'All' ? 'Everything' : KIND_META[option].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {(['All', ...TOPICS] as TopicFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={topic === option}
              onClick={() => setTopic(option)}
              className={cn(
                'h-8 rounded-full border px-3.5 font-mono text-xs transition-all duration-200 active:scale-[0.98]',
                topic === option
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
              )}
            >
              {option === 'All' ? 'All topics' : option}
            </button>
          ))}
        </div>
      </div>

      <p className="mono-label mt-8" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        {kind !== 'All' ? `, ${KIND_META[kind].label.toLowerCase()}` : ''}
        {topic !== 'All' ? `, ${topic}` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="border-line mt-6 rounded-2xl border border-dashed py-20 text-center">
          <p className="text-ink text-lg font-medium">Nothing matches &ldquo;{query}&rdquo;.</p>
          <p className="text-muted mt-2 text-sm">
            Try a topic like &ldquo;Alignment&rdquo;, or a voice like &ldquo;Hinton&rdquo;.
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
            {filtered.map((entry) => (
              <motion.div
                layout
                key={entry.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [...EASE] }}
                className="h-full"
              >
                <AfterCard entry={entry} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

function AfterCard({ entry }: { entry: AfterEntry }) {
  return (
    <article className="border-line bg-surface hover:border-ink/25 flex h-full flex-col rounded-2xl border p-6 transition-colors lg:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="mono-label text-accent">{KIND_META[entry.kind].label}</span>
        <span className="mono-label">{entry.date ? formatAfterDate(entry.date) : entry.topic}</span>
      </div>

      <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight">
        <Link
          href={`/superintelligence/${entry.slug}`}
          className="transition-opacity hover:opacity-75"
        >
          {entry.title}
        </Link>
      </h3>

      {entry.kind === 'quote' ? (
        <p className="text-ink mt-3 max-w-[60ch] leading-relaxed">&ldquo;{entry.summary}&rdquo;</p>
      ) : (
        <p className="text-muted mt-3 max-w-[60ch] leading-relaxed">{entry.summary}</p>
      )}

      {entry.figure && (
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-ink font-mono text-2xl tracking-tighter">{entry.figure.value}</span>
          <span className="text-muted max-w-[30ch] text-sm">{entry.figure.label}</span>
        </div>
      )}

      {entry.caveat && (
        <p className="border-line text-muted mt-5 border-t pt-4 text-sm leading-relaxed">
          <span className="text-ink font-medium">Limit: </span>
          {entry.caveat}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        <span className="mono-label max-w-[28ch] leading-relaxed">{entry.org}</span>
        <a
          href={entry.source.url}
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
