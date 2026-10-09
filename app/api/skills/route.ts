import { NextResponse } from 'next/server'
import { CRAFTS, getSkillEntries, queryEntries, type Craft } from '@/lib/registry'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const query = searchParams.get('q') ?? ''

  const validCategory: Craft | null =
    category && CRAFTS.some((c) => c === category) ? (category as Craft) : null

  const skills = getSkillEntries()
  const results = query
    ? queryEntries({ q: query, craft: validCategory }).filter((entry) => entry.kind === 'skill')
    : validCategory
      ? skills.filter((skill) => skill.craft === validCategory)
      : skills

  return NextResponse.json(
    {
      total: results.length,
      category: validCategory,
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
