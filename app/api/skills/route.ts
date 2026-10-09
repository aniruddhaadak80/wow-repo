import { NextResponse } from 'next/server'
import { CRAFTS, KINDS, getEntries, queryEntries, type Craft, type Kind } from '@/lib/registry'
import { IS_PAGES_EXPORT } from '@/lib/pages-export'

export const dynamic = IS_PAGES_EXPORT ? 'force-static' : 'force-dynamic'
export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const kind = searchParams.get('kind')
  const query = searchParams.get('q') ?? ''

  const validCategory: Craft | null =
    category && CRAFTS.some((c) => c === category) ? (category as Craft) : null
  const validKind: Kind | null = kind && KINDS.some((k) => k === kind) ? (kind as Kind) : null

  const all = getEntries()
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
