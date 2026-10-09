import { NextResponse } from 'next/server'
import {
  KINDS,
  TOPICS,
  getAfterEntries,
  getAfterEntriesByKind,
  searchAfter,
  type Kind,
  type Topic,
} from '@/lib/superintelligence'
import { IS_PAGES_EXPORT } from '@/lib/pages-export'

/*
 * `revalidate` is a literal (the static export needs one) and keys the Vercel
 * route cache per full URL. No `dynamic` export: segment config cannot be
 * computed, so it stays unset and Vercel keeps the route dynamic.
 */
export const revalidate = 3600

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}

export async function GET(request: Request) {
  // GitHub Pages has no server to read a query string from, so the exported
  // route serves the full list. The filterable API is a Vercel-only
  // convenience; every page on the site is prerendered either way.
  if (IS_PAGES_EXPORT) {
    const entries = getAfterEntries()
    return NextResponse.json(
      { total: entries.length, kind: null, topic: null, query: null, entries },
      { headers: CACHE_HEADERS },
    )
  }

  const { searchParams } = new URL(request.url)
  const kind = searchParams.get('kind')
  const topic = searchParams.get('topic')
  const query = searchParams.get('q') ?? ''

  const validKind = kind && KINDS.some((k) => k === kind) ? (kind as Kind) : null
  const validTopic = topic && TOPICS.some((t) => t === topic) ? (topic as Topic) : null

  const base = validKind ? getAfterEntriesByKind(validKind) : getAfterEntries()
  const results = query
    ? searchAfter(query).filter((entry) => (validKind ? entry.kind === validKind : true))
    : base

  const filtered = validTopic ? results.filter((entry) => entry.topic === validTopic) : results

  return NextResponse.json(
    {
      total: filtered.length,
      kind: validKind,
      topic: validTopic,
      query: query || null,
      entries: filtered,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
