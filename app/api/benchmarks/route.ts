import { NextResponse } from 'next/server'
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
 * Runs per request so `track`, `q`, and `sort` always resolve. Freshness is
 * delegated to the response Cache-Control header: the CDN serves a cached body
 * for an hour and revalidates in the background. Do not add `revalidate` here;
 * prerendering a parameterised response would ignore the query string.
 */
import { IS_PAGES_EXPORT } from '@/lib/pages-export'

export const dynamic = IS_PAGES_EXPORT ? 'force-static' : 'force-dynamic'

const SORT_KEYS: SortKey[] = ['score', 'delta', 'latency', 'cost', 'name']

export async function GET(request: Request) {
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
