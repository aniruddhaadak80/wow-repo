import { NextResponse } from 'next/server'

import { getSkillEntries } from '@/lib/registry'
import { IS_PAGES_EXPORT } from '@/lib/pages-export'

export const dynamic = IS_PAGES_EXPORT ? 'force-static' : 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
