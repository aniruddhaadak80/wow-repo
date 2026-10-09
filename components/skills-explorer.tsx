'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { CRAFTS, getSkillEntries } from '@/lib/registry'
import type { Craft, RegistryEntry } from '@/content/registry'
import { SkillCard } from '@/components/skill-card'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

type Filter = 'All' | Craft

export function SkillsExplorer() {
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const entries = getSkillEntries()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((entry) => {
      const matchesFilter = filter === 'All' || entry.craft === filter
      if (!matchesFilter) return false
      if (!q) return true
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.tagline.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.craft.toLowerCase().includes(q) ||
        entry.triggers.some((trigger) => trigger.toLowerCase().includes(q))
      )
    })
  }, [entries, query, filter])

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
            placeholder="Search by name, craft, or trigger"
            className="border-line bg-surface text-ink placeholder:text-muted focus:border-accent h-11 w-full rounded-full border pr-10 pl-11 text-sm transition-colors outline-none"
            aria-label="Search skills"
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

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by craft">
          {(['All', ...CRAFTS] as Filter[]).map((craft) => (
            <button
              key={craft}
              type="button"
              aria-pressed={filter === craft}
              onClick={() => setFilter(craft)}
              className={cn(
                'h-9 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                filter === craft
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
              )}
            >
              {craft}
            </button>
          ))}
        </div>
      </div>

      <p className="mono-label mt-8" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'skill' : 'skills'}
        {filter !== 'All' ? ` in ${filter}` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="border-line mt-6 rounded-2xl border border-dashed py-20 text-center">
          <p className="text-ink text-lg font-medium">Nothing matches “{query}”.</p>
          <p className="text-muted mt-2 text-sm">
            Try a craft like “Design”, or a trigger like “landing page”.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setFilter('All')
            }}
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
