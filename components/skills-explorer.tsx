'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { CRAFTS, KIND_META, KINDS, getEntries, getRegistryCounts } from '@/lib/registry'
import type { Craft, Kind, RegistryEntry } from '@/content/registry'
import { SkillCard } from '@/components/skill-card'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

type KindFilter = 'All' | Kind
type CraftFilter = 'All' | Craft

function parseKind(value: string | null): KindFilter {
  return KINDS.some((kind) => kind === value) ? (value as Kind) : 'All'
}

function parseCraft(value: string | null): CraftFilter {
  return CRAFTS.some((craft) => craft === value) ? (value as Craft) : 'All'
}

function countText(length: number, noun: string) {
  return `${length} ${length === 1 ? noun : `${noun}s`}`
}

export function SkillsExplorer() {
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('All')
  const [craft, setCraft] = useState<CraftFilter>('All')

  const entries = getEntries()
  const counts = getRegistryCounts()

  /*
   * Filter state lives in the URL so a filtered view is shareable and the back
   * button walks back through it.
   *
   * The prerendered HTML carries the full unfiltered grid, which is what
   * Lighthouse scores and what a crawler reads. Reading the params in an effect
   * (rather than through useSearchParams) keeps that HTML intact: the page
   * stays fully static, and the filter applies the moment the component mounts.
   */
  useEffect(() => {
    const read = () => {
      const sp = new URLSearchParams(window.location.search)
      setQuery(sp.get('q') ?? '')
      setKind(parseKind(sp.get('kind')))
      setCraft(parseCraft(sp.get('craft')))
    }
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])

  const syncParams = useCallback(
    (next: { kind: KindFilter; craft: CraftFilter; q: string }, push: boolean) => {
      const sp = new URLSearchParams(window.location.search)
      next.kind === 'All' ? sp.delete('kind') : sp.set('kind', next.kind)
      next.craft === 'All' ? sp.delete('craft') : sp.set('craft', next.craft)
      next.q ? sp.set('q', next.q) : sp.delete('q')
      const url = sp.size
        ? `${window.location.pathname}?${sp.toString()}`
        : window.location.pathname
      // Typing should not flood history; a deliberate filter choice should.
      window.history[push ? 'pushState' : 'replaceState']({}, '', url)
    },
    [],
  )

  const pickKind = (option: KindFilter) => {
    setKind(option)
    syncParams({ kind: option, craft, q: query }, true)
  }

  const pickCraft = (option: CraftFilter) => {
    setCraft(option)
    syncParams({ kind, craft: option, q: query }, true)
  }

  const onQuery = (value: string) => {
    setQuery(value)
    syncParams({ kind, craft, q: value }, false)
  }

  function reset() {
    setQuery('')
    setKind('All')
    setCraft('All')
    window.history.pushState({}, '', window.location.pathname)
  }

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
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search by name, craft, kind, or trigger"
            className="border-line bg-surface text-ink placeholder:text-muted focus:border-accent h-11 w-full rounded-full border pr-10 pl-11 text-sm transition-colors outline-none"
            aria-label="Search the registry"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery('')}
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
              onClick={() => pickKind(option)}
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
            onClick={() => pickCraft(option)}
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
        {countText(filtered.length, 'entry')}
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
