'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { CRAFTS, KIND_META, KINDS, getEntries, getRegistryCounts } from '@/lib/registry'
import type { Craft, Kind, RegistryEntry } from '@/content/registry'
import { SkillCard } from '@/components/skill-card'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

type KindFilter = 'All' | Kind
type CraftFilter = 'All' | Craft

export function SkillsExplorer() {
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('All')
  const [craft, setCraft] = useState<CraftFilter>('All')

  const entries = getEntries()
  const counts = getRegistryCounts()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((entry) => {
      if (kind !== 'All' && entry.kind !== kind) return false
      if (craft !== 'All' && entry.craft !== craft) return false
      if (!q) return true
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.tagline.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.craft.toLowerCase().includes(q) ||
        KIND_META[entry.kind].label.toLowerCase().includes(q) ||
        entry.triggers.some((trigger) => trigger.toLowerCase().includes(q))
      )
    })
  }, [entries, query, kind, craft])

  function reset() {
    setQuery('')
    setKind('All')
    setCraft('All')
  }

  return (
    <div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlass
            weight="regular"
            className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, craft, kind, or trigger"
            className="border-line bg-surface text-ink placeholder:text-muted focus:border-accent h-11 w-full rounded-full border pr-10 pl-11 text-sm transition-colors outline-none"
            aria-label="Search the registry"
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
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
        {(['All', ...KINDS] as KindFilter[]).map((option) => {
          const count = option === 'All' ? counts.total : counts.byKind[option]
          return (
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
              <span className="ml-2 font-mono text-xs">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by craft">
        {(['All', ...CRAFTS] as CraftFilter[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={craft === option}
            onClick={() => setCraft(option)}
            className={cn(
              'h-8 rounded-full border px-3.5 text-xs font-medium transition-all duration-200 active:scale-[0.98]',
              craft === option
                ? 'border-ink/30 bg-elevated text-ink'
                : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="mono-label mt-8" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        {kind !== 'All' ? ` in ${KIND_META[kind].label}` : ''}
        {craft !== 'All' ? ` for ${craft}` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="border-line mt-6 rounded-2xl border border-dashed py-20 text-center">
          <p className="text-ink text-lg font-medium">Nothing matches “{query}”.</p>
          <p className="text-muted mt-2 text-sm">
            Try a kind like “MCP server”, or a craft like “Design”.
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
        <motion.div
          layout={!reduce}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((entry: RegistryEntry) => (
              <motion.div
                layout={!reduce}
                key={entry.slug}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [...EASE] }}
                className="h-full"
              >
                <SkillCard entry={entry} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
