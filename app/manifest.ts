/*
 * Metadata routes are static by nature. The literal config is also what the
 * GitHub Pages static export needs: route segment config cannot be computed,
 * so it is written once and read by both deploy targets.
 */
export const revalidate = 3600

import type { MetadataRoute } from 'next'

/*
 * Static content, revalidated hourly. The literal config is also what the
 * GitHub Pages static export needs: route segment config cannot be computed,
 * so it is written once and read by both deploy targets.
 */
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
    shortcuts: [
      {
        name: 'The registry',
        short_name: 'Registry',
        description: 'Search every skill, MCP server, API, protocol, harness, and tool.',
        url: '/skills',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      {
        name: 'Choose a stack',
        short_name: 'Choose',
        description: 'Answer three questions and get a shortlist with its reasons.',
        url: '/choose',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      {
        name: 'Glossary quiz',
        short_name: 'Quiz',
        description: 'Three seeded papers over the vocabulary of the stack.',
        url: '/glossary/quiz',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    ],
  }
}
