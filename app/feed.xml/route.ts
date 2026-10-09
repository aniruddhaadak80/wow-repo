import { getEntries } from '@/lib/registry'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/*
 * RSS over the registry. The newest entries by `addedAt` lead, so a feed reader
 * sees what changed most recently. Static by design: no request is read, which
 * is also what the GitHub Pages static export requires.
 */
export async function GET() {
  const entries = [...getEntries()].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 30)

  const items = entries
    .map((entry) => {
      const link = `${SITE_URL}/skills/${entry.slug}`
      const pubDate = new Date(`${entry.addedAt}T00:00:00Z`).toUTCString()
      return [
        '    <item>',
        `      <title>${escapeXml(entry.name)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <category>${escapeXml(entry.kind)}</category>`,
        `      <description>${escapeXml(`${entry.tagline} ${entry.description}`)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>wow-repo</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>New entries in the open agent stack registry, newest first.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
