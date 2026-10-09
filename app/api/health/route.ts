import { NextResponse } from 'next/server'
import { IS_PAGES_EXPORT } from '@/lib/pages-export'

/*
 * `revalidate` is a literal (the static export needs one) while the response
 * stays `no-store`, so the CDN and browsers never serve a cached health body.
 */
export const revalidate = 3600

export async function GET() {
  // A static export has no server and no clock of its own: the timestamp would
  // freeze at build time and quietly tell whoever polled it that the site was
  // deployed then. The exported route reports status only, which stays true.
  const body = IS_PAGES_EXPORT
    ? { status: 'ok' }
    : { status: 'ok', timestamp: new Date().toISOString() }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
