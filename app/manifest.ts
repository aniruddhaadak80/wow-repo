import type { MetadataRoute } from 'next'

/*
 * Static content, revalidated hourly. The literal config is also what the
 * GitHub Pages static export needs: route segment config cannot be computed,
 * so it is written once and read by both deploy targets.
 */
export const revalidate = 3600

/*
 * PWA manifest. The site installs to a home screen and launches standalone,
 * which is what makes the "app" in the app showcase a real app rather than a
 * picture of one. Icons are SVG with sizes "any" so they serve every density
 * from one asset; regenerate PNG variants if a store listing ever needs them.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'wow*: Agent skills in your pocket',
    short_name: 'wow*',
    description:
      'Browse, install, and run curated agent skills from your phone. A production-ready Next.js showcase.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0b0c',
    theme_color: '#0b0b0c',
    categories: ['developer', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
