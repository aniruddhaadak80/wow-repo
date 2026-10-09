import type { MetadataRoute } from 'next'
import { getEntrySlugs } from '@/lib/registry'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getEntrySlugs()
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
      url: `${SITE_URL}/skills`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/skills/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
