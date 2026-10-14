'use client'

import { useSyncExternalStore } from 'react'
import { readLocalList, subscribeLocalList } from '@/lib/local-collections'

const KEY = 'wow-bookmarks'

/**
 * The live count of saved entries, for the mobile tab bar.
 *
 * Deliberately tiny: it reads the bookmark list and nothing else, so the tab
 * bar (which renders on every page) never pulls the catalog into its bundle.
 * The badge is aria-hidden so the tab keeps the accessible name "Saved".
 */
export function SavedBadge() {
  const count = useSyncExternalStore(
    subscribeLocalList,
    () => String(readLocalList(KEY).length),
    () => '0',
  )
  if (count === '0') return null
  return (
    <span aria-hidden="true" className="text-accent ml-1 font-mono text-[10px] tabular-nums">
      {count}
    </span>
  )
}
