import { NextResponse } from 'next/server'
import { CRAFTS, KINDS, getEntries, queryEntries, type Craft, type Kind } from '@/lib/registry'
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
  const all = getEntries()

  // GitHub Pages has no server to read a query string from, so the exported
  // route serves the whole registry. The filterable API is a Vercel-only
  // convenience; every page on the site is prerendered either way.
  if (IS_PAGES_EXPORT) {
    return NextResponse.json(
      { total: all.length, category: null, kind: null, query: null, skills: all },
      { headers: CACHE_HEADERS },
    )
  }

  const { searchParams } = new URL(request.url)
  // `craft` is the documented name (README, footer). `category` stays as an
  // alias so an older link that used it keeps filtering instead of silently
  // returning the whole catalog.
  const category = searchParams.get('craft') ?? searchParams.get('category')
  const kind = searchParams.get('kind')
  const query = searchParams.get('q') ?? ''

  const validCategory: Craft | null =
    category && CRAFTS.some((c) => c === category) ? (category as Craft) : null
  const validKind: Kind | null = kind && KINDS.some((k) => k === kind) ? (kind as Kind) : null

  const results = query
    ? queryEntries({ q: query, craft: validCategory, kind: validKind })
    : validKind
      ? all.filter(
          (entry) => entry.kind === validKind && (!validCategory || entry.craft === validCategory),
        )
      : validCategory
        ? all.filter((entry) => entry.craft === validCategory)
        : all

  return NextResponse.json(
    {
      total: results.length,
      category: validCategory,
      kind: validKind,
      query: query || null,
      skills: results,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
