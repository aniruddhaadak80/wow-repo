/*
 * Metadata routes are static by nature. The literal config is also what the
 * GitHub Pages static export needs: route segment config cannot be computed,
 * so it is written once and read by both deploy targets.
 */
export const revalidate = 3600

import type { MetadataRoute } from 'next'
import { getEntrySlugs } from '@/lib/registry'
import { getAfterSlugs } from '@/lib/superintelligence'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getEntrySlugs()
  const afterSlugs = getAfterSlugs()
  const now = new Date()

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/agents`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/discoveries`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/superintelligence`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...afterSlugs.map((slug) => ({
      url: `${SITE_URL}/superintelligence/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/skills`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/skills/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
