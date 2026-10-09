import { NextResponse } from 'next/server'
import {
  FIELDS,
  getFindings,
  getFindingsByTrack,
  searchFindings,
  TRACKS,
  type Track,
} from '@/lib/findings'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(request: Request) {
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
