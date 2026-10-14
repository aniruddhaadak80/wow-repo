'use client'

import { useSyncExternalStore } from 'react'
import { Bookmark, BookmarkSimple } from '@phosphor-icons/react'
import { getEntries } from '@/lib/registry'
import { readLocalList, subscribeLocalList, toggleLocalList } from '@/lib/local-collections'
import { cn } from '@/lib/cn'

const KEY = 'wow-bookmarks'

/*
 * Save an entry to a local shelf. The shelf lives in localStorage, so it
 * survives reloads, needs no account, and works on the static export: the
 * server renders the unsaved state and the client takes over on hydration.
 */
export function BookmarkButton({
  slug,
  name,
  className,
}: {
  slug: string
  name: string
  className?: string
}) {
  const has = useSyncExternalStore(
    subscribeLocalList,
    () => (readLocalList(KEY).includes(slug) ? '1' : '0'),
    () => '0',
  )
  const saved = has === '1'

  return (
    <button
      type="button"
      onClick={() => toggleLocalList(KEY, slug)}
      aria-pressed={saved}
      aria-label={`${saved ? 'Saved' : 'Save'} ${name}`}
      className={cn(
        'border-line bg-surface text-muted hover:text-ink hover:border-ink/30 inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-colors active:scale-[0.97]',
        saved && 'border-accent-soft text-accent',
        className,
      )}
    >
      {saved ? (
        <BookmarkSimple weight="fill" className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Bookmark weight="regular" className="h-3.5 w-3.5" aria-hidden />
      )}
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

/** The saved count, for badges and the mobile tab bar. */
export function useSavedCount(): string {
  return useSyncExternalStore(
    subscribeLocalList,
    () => String(readLocalList(KEY).length),
    () => '0',
  )
}

/** Resolves the saved slugs to catalog entries, oldest save first. */
export function getSavedEntries() {
  const catalog = getEntries()
  const bySlug = new Map(catalog.map((entry) => [entry.slug, entry]))
  return readLocalList(KEY)
    .map((slug) => bySlug.get(slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
}
