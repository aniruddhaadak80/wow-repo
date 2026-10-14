'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { queryGlossary } from '@/lib/glossary'
import { GlossaryEntry } from '@/components/glossary-entry'

/**
 * The glossary search.
 *
 * The full glossary is rendered on the server and passed in as `children`, so
 * the terms are in the HTML for search engines and for readers with
 * JavaScript off. Type in the box and the server list is hidden while the
 * matched terms render from the same data, which means the page never shows
 * the same term twice. Filtering is local, so it works on the static export.
 */
export function GlossaryBrowser({ total, children }: { total: number; children: ReactNode }) {
  const [query, setQuery] = useState('')
  const trimmed = query.trim()
  const searching = trimmed.length > 0
  const results = useMemo(
    () => (searching ? queryGlossary({ q: trimmed }) : []),
    [searching, trimmed],
  )

  return (
    <div className="mt-10">
      <div className="relative max-w-xl">
        <MagnifyingGlass
          weight="regular"
          className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
          aria-hidden
        />
        <label htmlFor="glossary-search" className="sr-only">
          Search the glossary
        </label>
        <input
          id="glossary-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search terms, definitions, and details"
          className="border-line bg-surface text-ink placeholder:text-muted focus:border-accent h-12 w-full rounded-full border pr-4 pl-11 text-sm transition-colors outline-none"
        />
      </div>

      <p className="mono-label mt-4" aria-live="polite">
        {searching ? `${results.length} of ${total} terms` : `${total} terms`}
      </p>

      {searching &&
        (results.length === 0 ? (
          <p className="text-muted mt-8 text-sm leading-relaxed">
            Nothing matches that search. Every term here is one you would meet while building with
            agents, so try a broader word.
          </p>
        ) : (
          <dl className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            {results.map((item) => (
              <GlossaryEntry key={item.term} item={item} onSelect={setQuery} />
            ))}
          </dl>
        ))}

      <div hidden={searching}>{children}</div>
    </div>
  )
}
