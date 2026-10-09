import { NextResponse } from 'next/server'
import { IS_PAGES_EXPORT } from '@/lib/pages-export'
import {
  BENCHMARK_TRACKS,
  filterByTrack,
  getBenchmarkEntries,
  rankEntries,
  searchEntries,
  sortEntries,
  type BenchmarkTrack,
  type SortKey,
  type TrackFilter,
} from '@/lib/benchmarks'

/*
 * Freshness is delegated to the response Cache-Control header: the CDN serves
 * a cached body for an hour and revalidates in the background.
 *
 * `revalidate` is a literal, which is what the GitHub Pages static export
 * needs (segment config cannot be computed) and what keys the Vercel route
 * cache, per full URL, so each `track`/`q`/`sort` combination caches separately.
 */
export const revalidate = 3600

const SORT_KEYS: SortKey[] = ['score', 'delta', 'latency', 'cost', 'name']

export async function GET(request: Request) {
  // GitHub Pages has no server to read a query string from, so the exported
  // route serves the default view: every entry, sorted by score, ranked.
  if (IS_PAGES_EXPORT) {
    const entries = rankEntries(sortEntries(getBenchmarkEntries(), 'score'))
    return NextResponse.json(
      { total: entries.length, track: 'all', sort: 'score', query: null, entries },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    )
  }

  const { searchParams } = new URL(request.url)
  const track = searchParams.get('track')
  const query = searchParams.get('q') ?? ''
  const sort = searchParams.get('sort')

  const validTrack: TrackFilter =
    track && (BENCHMARK_TRACKS as readonly string[]).includes(track)
      ? (track as BenchmarkTrack)
      : 'all'
  const validSort: SortKey =
    sort && SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : 'score'

  const filtered = searchEntries(filterByTrack(getBenchmarkEntries(), validTrack), query)
  const entries = rankEntries(sortEntries(filtered, validSort))

  return NextResponse.json(
    {
      total: entries.length,
      track: validTrack,
      sort: validSort,
      query: query || null,
      entries,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
