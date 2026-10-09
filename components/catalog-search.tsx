'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'
import type { RegistryEntry } from '@/content/registry'

const MAX_RESULTS = 4

function matches(entry: RegistryEntry, query: string): boolean {
  if (!query) return true
  return (
    entry.name.toLowerCase().includes(query) ||
    entry.tagline.toLowerCase().includes(query) ||
    entry.craft.toLowerCase().includes(query) ||
    entry.triggers.some((trigger) => trigger.toLowerCase().includes(query))
  )
}

/**
 * A live slice of the catalog, running in the page. This is a real component
 * with real state, not a screenshot: submitting it opens the full catalog at
 * /skills?q=... with the same query applied.
 */
export function CatalogSearch({ entries }: { entries: RegistryEntry[] }) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((entry) => matches(entry, q)).slice(0, MAX_RESULTS)
  }, [entries, query])

  const total = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((entry) => matches(entry, q)).length
  }, [entries, query])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        router.push(`/skills?q=${encodeURIComponent(query.trim())}`)
      }}
      className="border-line bg-surface rounded-2xl border p-5 sm:p-6"
    >
      <label htmlFor="catalog-search" className="mono-label block">
        Search the catalog
      </label>
      <div className="relative mt-2">
        <MagnifyingGlass
          weight="regular"
          className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
        />
        <input
          id="catalog-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="design, vercel, prisma, thread"
          autoComplete="off"
          className="border-line bg-bg text-ink placeholder:text-muted focus:border-accent h-12 w-full rounded-full border pr-4 pl-11 text-sm transition-colors outline-none"
        />
      </div>

      <p className="mono-label mt-3 flex items-center justify-between gap-3" aria-live="polite">
        <span>
          {total} {total === 1 ? 'match' : 'matches'}
        </span>
      </p>

      <ul className="mt-3 space-y-1">
        <AnimatePresence initial={false} mode="popLayout">
          {results.map((entry) => (
            <motion.li
              key={entry.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [...EASE] }}
            >
              <button
                type="button"
                onClick={() => router.push(`/skills/${entry.slug}`)}
                className="hover:bg-elevated flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
              >
                <span className="bg-accent-soft text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-semibold">
                  {entry.name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-ink block truncate text-sm font-medium">{entry.name}</span>
                  <span className="text-muted block truncate text-xs">{entry.tagline}</span>
                </span>
                <span className="mono-label shrink-0">{entry.craft}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {total === 0 && (
        <p className="border-line text-muted mt-3 rounded-2xl border border-dashed px-4 py-6 text-center text-sm">
          Nothing matches that. The catalog has {entries.length} entries across six kinds.
        </p>
      )}

      <button
        type="submit"
        className={cn(
          'group bg-accent mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3',
          'text-on-accent text-sm font-semibold transition-[filter,transform] duration-200',
          'hover:brightness-110 active:scale-[0.98]',
        )}
      >
        Browse the registry
        <ArrowRight
          weight="regular"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </button>
    </form>
  )
}
