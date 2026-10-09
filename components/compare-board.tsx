'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowsLeftRight, Plus, X } from '@phosphor-icons/react'
import { getEntries } from '@/lib/registry'
import {
  COMPARE_LIMIT,
  buildCompareRows,
  getCompareEntries,
  remainingCandidates,
  sharedTriggers,
} from '@/lib/compare'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

/*
 * Selection lives in the URL so a comparison is shareable and survives a
 * reload. The server page renders a static shell (the static export cannot
 * read a query string), and this island owns everything interactive: the
 * store is the URL itself, subscribed through useSyncExternalStore, so there
 * is no effect that mirrors state and no chance of the two drifting.
 */
const COMPARE_EVENT = 'wow-compare:change'

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener(COMPARE_EVENT, callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(COMPARE_EVENT, callback)
  }
}

function readSlugParam(): string {
  return new URLSearchParams(window.location.search).get('with') ?? ''
}

function writeSlugs(slugs: string[]) {
  const url = new URL(window.location.href)
  if (slugs.length) url.searchParams.set('with', slugs.join(','))
  else url.searchParams.delete('with')
  window.history.replaceState(window.history.state, '', url)
  window.dispatchEvent(new Event(COMPARE_EVENT))
}

export function CompareBoard() {
  const reduce = useReducedMotion()
  const catalog = useMemo(() => getEntries(), [])
  const [query, setQuery] = useState('')

  const slugParam = useSyncExternalStore(subscribe, readSlugParam, () => '')
  const selected = useMemo(() => resolveFromParam(slugParam, catalog), [slugParam, catalog])
  const entries = useMemo(() => getCompareEntries(selected, catalog), [selected, catalog])
  const rows = useMemo(() => buildCompareRows(entries), [entries])
  const overlap = useMemo(() => sharedTriggers(entries), [entries])
  const candidates = useMemo(
    () => remainingCandidates(selected, catalog, query),
    [selected, catalog, query],
  )

  const full = selected.length >= COMPARE_LIMIT

  return (
    <div className="mt-12">
      {/* Selected columns */}
      <div className="flex flex-wrap items-center gap-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.span
              key={entry.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [...EASE] }}
              className="border-line bg-surface flex items-center gap-2 rounded-full border py-1.5 pr-2 pl-3.5"
            >
              <span className="text-ink text-sm font-medium">{entry.name}</span>
              <button
                type="button"
                onClick={() => writeSlugs(selected.filter((slug) => slug !== entry.slug))}
                className="text-muted hover:text-ink flex h-6 w-6 items-center justify-center rounded-full transition-colors"
                aria-label={`Remove ${entry.name} from the comparison`}
              >
                <X weight="regular" className="h-3.5 w-3.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        {entries.length === 0 && (
          <p className="text-muted text-sm">Pick entries below to compare.</p>
        )}
      </div>

      {/* The comparison itself */}
      {entries.length >= 2 && (
        <div className="mt-8">
          {overlap.length > 0 && (
            <p className="mono-label mb-4">Shared triggers: {overlap.join(', ')}</p>
          )}

          {/* Mobile: one card per entry, so nothing scrolls sideways */}
          <div className="grid gap-4 md:hidden">
            {entries.map((entry) => (
              <article key={entry.slug} className="border-line bg-surface rounded-2xl border p-5">
                <h3 className="text-ink text-base font-semibold tracking-tight">{entry.name}</h3>
                <p className="text-muted mt-1 text-sm">{entry.tagline}</p>
                <dl className="mt-4 space-y-3">
                  {rows.map((row) => (
                    <div
                      key={row.label}
                      className="border-line border-t pt-3 first:border-0 first:pt-0"
                    >
                      <dt className="mono-label text-[10px]">{row.label}</dt>
                      <dd className="text-ink mt-1 text-sm break-words">
                        {row.values[entries.indexOf(entry)] ?? 'Not listed'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          {/* Desktop: one row per field */}
          <div className="border-line hidden overflow-x-auto rounded-2xl border md:block">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Registry entries compared field by field, {entries.length} entries
              </caption>
              <thead>
                <tr className="border-line border-b">
                  <th scope="col" className="mono-label px-5 py-4 font-normal">
                    Field
                  </th>
                  {entries.map((entry) => (
                    <th key={entry.slug} scope="col" className="px-5 py-4 align-top">
                      <span className="text-ink block text-sm font-semibold">{entry.name}</span>
                      <span className="text-muted mt-1 block max-w-[26ch] text-xs leading-relaxed">
                        {entry.tagline}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-line border-b last:border-0">
                    <th scope="row" className="mono-label px-5 py-4 font-normal">
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${entries[index].slug}`}
                        className={cn(
                          'px-5 py-4 align-top text-sm break-words',
                          value ? 'text-ink' : 'text-muted',
                        )}
                      >
                        {value ?? 'Not listed'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {entries.length === 1 && (
        <p className="mono-label mt-8">Add a second entry to compare fields.</p>
      )}

      {/* Picker */}
      <div className="border-line mt-10 border-t pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="compare-search" className="sr-only">
            Search the registry to add an entry
          </label>
          <input
            id="compare-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={full ? `Comparison is full (${COMPARE_LIMIT} max)` : 'Search the registry'}
            disabled={full}
            className="border-line bg-surface text-ink placeholder:text-muted focus:border-accent h-11 w-full rounded-full border px-4 text-sm transition-colors outline-none disabled:cursor-not-allowed sm:max-w-sm"
          />
          <span className="mono-label">
            {full ? 'Remove one to add another' : `${selected.length} of ${COMPARE_LIMIT} selected`}
          </span>
        </div>

        {!full && (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((entry) => (
              <li key={entry.slug}>
                <button
                  type="button"
                  onClick={() => writeSlugs([...selected, entry.slug].slice(0, COMPARE_LIMIT))}
                  className="border-line bg-surface hover:border-ink/30 group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors active:scale-[0.99]"
                >
                  <span className="bg-accent-soft text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Plus weight="regular" className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="text-ink block truncate text-sm font-medium">
                      {entry.name}
                    </span>
                    <span className="text-muted block truncate text-xs">{entry.tagline}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!full && candidates.length === 0 && (
          <p className="text-muted mt-5 text-sm">
            Nothing matches that search across the remaining {catalog.length - selected.length}{' '}
            entries.
          </p>
        )}
      </div>
    </div>
  )
}

/** Parses the `with` param against the catalog: known, unique, capped. */
function resolveFromParam(param: string, catalog: ReturnType<typeof getEntries>): string[] {
  return param
    .split(',')
    .filter(Boolean)
    .filter((slug) => catalog.some((entry) => entry.slug === slug))
    .filter((slug, index, all) => all.indexOf(slug) === index)
    .slice(0, COMPARE_LIMIT)
}

/** Featured pairs, offered as one-click starting points. */
export function ComparePresets({ slugs }: { slugs: string[] }) {
  const catalog = useMemo(() => getEntries(), [])
  const entries = useMemo(() => getCompareEntries(slugs, catalog), [slugs, catalog])

  return (
    <div className="border-line bg-surface mt-8 rounded-2xl border p-6">
      <p className="mono-label flex items-center gap-2">
        <ArrowsLeftRight weight="regular" className="h-4 w-4" aria-hidden />
        Start from a pair
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entries.map((entry, index) => {
          const pair = [entries[index].slug, entries[(index + 1) % entries.length].slug]
          return (
            <button
              key={entry.slug}
              type="button"
              onClick={() => writeSlugs(pair)}
              className="border-line text-muted hover:text-ink hover:border-ink/30 rounded-full border px-4 py-2 text-sm transition-colors active:scale-[0.98]"
            >
              {entry.name} + {entries[(index + 1) % entries.length].name}
            </button>
          )
        })}
      </div>
      <p className="text-muted mt-4 text-sm leading-relaxed">
        A comparison is a real URL. Pick a pair above, or search for any two entries, and the
        address bar updates so you can share it.
      </p>
    </div>
  )
}
