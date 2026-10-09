import { NextResponse } from 'next/server'
import {
  FIELDS,
  getFindings,
  getFindingsByTrack,
  searchFindings,
  TRACKS,
  type Track,
} from '@/lib/findings'
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
    const findings = getFindings()
    return NextResponse.json(
      { total: findings.length, track: null, field: null, query: null, findings },
      { headers: CACHE_HEADERS },
    )
  }

  const { searchParams } = new URL(request.url)
  const track = searchParams.get('track')
  const field = searchParams.get('field')
  const query = searchParams.get('q') ?? ''

  const validTrack = track && TRACKS.some((t) => t === track) ? (track as Track) : null
  const validField = field && FIELDS.some((f) => f === field) ? field : null

  const base = validTrack ? getFindingsByTrack(validTrack) : getFindings()
  const results = query
    ? searchFindings(query).filter((finding) => (validTrack ? finding.track === validTrack : true))
    : base

  const filtered = validField ? results.filter((finding) => finding.field === validField) : results

  return NextResponse.json(
    {
      total: filtered.length,
      track: validTrack,
      field: validField,
      query: query || null,
      findings: filtered,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
