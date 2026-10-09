/*
 * Metadata routes are static by nature. The literal config is also what the
 * GitHub Pages static export needs: route segment config cannot be computed,
 * so it is written once and read by both deploy targets.
 */
export const revalidate = 3600

import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
