'use client'

import { useEffect, useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ClockCounterClockwise } from '@phosphor-icons/react'
import { getEntries } from '@/lib/registry'
import {
  readLocalList,
  pushLocalList,
  subscribeLocalList,
  getServerList,
} from '@/lib/local-collections'

const KEY = 'wow-recent'
const LIMIT = 8

/**
 * The short list of entries you already opened, newest first.
 *
 * The list is recorded from an effect because the source of truth is
 * localStorage, not React: the effect writes to that external system and
 * the subscribed components re-read. The server renders nothing, which
 * keeps the static export and hydration honest.
 */
export function RecentlyViewed({ current }: { current: string }) {
  const slugs = useSyncExternalStore(
    subscribeLocalList,
    () => readLocalList(KEY).join('|'),
    () => getServerList().join('|'),
  )
  const seen = useMemo(() => slugs.split('|').filter(Boolean), [slugs])

  useEffect(() => {
    pushLocalList(KEY, current, LIMIT)
  }, [current])

  const catalog = useMemo(() => getEntries(), [])
  const entries = useMemo(
    () =>
      seen
        .filter((slug) => slug !== current)
        .map((slug) => catalog.find((entry) => entry.slug === slug))
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    [seen, current, catalog],
  )

  if (entries.length === 0) return null

  return (
    <section className="border-line mt-16 border-t pt-12">
      <h2 className="mono-label flex items-center gap-2">
        <ClockCounterClockwise weight="regular" className="h-3.5 w-3.5" aria-hidden />
        Recently viewed
      </h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/skills/${entry.slug}`}
              className="border-line bg-surface text-muted hover:text-ink hover:border-ink/30 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors"
            >
              {entry.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
