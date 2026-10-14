'use client'

import Link from 'next/link'
import { Bookmarks, Trash } from '@phosphor-icons/react'
import { BookmarkButton, getSavedEntries } from '@/components/bookmark-button'
import {
  readLocalList,
  writeLocalList,
  subscribeLocalList,
  getServerList,
} from '@/lib/local-collections'
import { useSyncExternalStore } from 'react'
import { CopyButton } from '@/components/copy-button'
import { KIND_META } from '@/content/registry'

const KEY = 'wow-bookmarks'

/**
 * The saved shelf. Entries live in localStorage, so this page needs no
 * account, no server, and works identically on the static export: the
 * server renders the empty state and the client fills it in.
 */
export function BookmarksShelf() {
  const saved = useSyncExternalStore(
    subscribeLocalList,
    () => readLocalList(KEY).join('|'),
    () => getServerList().join('|'),
  )

  // Recomputed on every change rather than cached, because the cheapest
  // correct thing to do with a catalog this size is to read it again.
  const entries = saved ? getSavedEntries() : []
  const slugs = saved.split('|').filter(Boolean)

  const clearAll = () => writeLocalList(KEY, [])

  if (slugs.length === 0) {
    return (
      <div className="border-line bg-surface mt-12 rounded-2xl border p-10 text-center">
        <span className="bg-accent-soft text-accent mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
          <Bookmarks weight="regular" className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-ink mt-5 font-semibold">Nothing saved yet.</p>
        <p className="text-muted mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed">
          Open any registry entry and press Save. The shelf lives in this browser, so it is here
          next time without an account.
        </p>
        <Link
          href="/skills"
          className="border-line text-ink hover:border-ink/30 mt-6 inline-flex h-11 items-center rounded-full border px-6 text-sm font-medium transition-colors"
        >
          Browse the registry
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between gap-4">
        <p className="mono-label">
          {slugs.length} saved {slugs.length === 1 ? 'entry' : 'entries'}
        </p>
        <button
          type="button"
          onClick={clearAll}
          className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          <Trash weight="regular" className="h-3.5 w-3.5" aria-hidden />
          Clear all
        </button>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <article className="border-line bg-surface flex h-full flex-col rounded-2xl border p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="bg-accent-soft text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-base font-semibold">
                  {entry.name.charAt(0)}
                </span>
                <span className="border-line text-muted rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase">
                  {KIND_META[entry.kind].label}
                </span>
              </div>

              <h2 className="text-ink mt-4 font-medium tracking-tight">
                <Link
                  href={`/skills/${entry.slug}`}
                  className="hover:text-accent transition-colors"
                >
                  {entry.name}
                </Link>
              </h2>
              <p className="text-muted mt-1 text-sm leading-relaxed">{entry.tagline}</p>

              <div className="mt-auto flex items-center gap-2 pt-5">
                <CopyButton text={entry.command} />
                <BookmarkButton slug={entry.slug} name={entry.name} />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
