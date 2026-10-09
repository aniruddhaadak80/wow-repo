import type { MetadataRoute } from 'next'
import { getSkillSlugs } from '@/lib/registry'
import { getFindingSlugs } from '@/lib/findings'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getSkillSlugs()
  const findingSlugs = getFindingSlugs()
  const now = new Date()

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/skills`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/discoveries`,
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
    ...findingSlugs.map((slug) => ({
      url: `${SITE_URL}/discoveries/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
