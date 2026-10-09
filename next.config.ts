import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'
import { IS_PAGES_EXPORT, PAGES_BASE_PATH } from './lib/pages-export'

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/*
 * GitHub Pages builds the same app as a fully static site. `GH_PAGES=true`
 * (set by .github/workflows/pages.yml) swaps the server-only pieces for static
 * equivalents: no image optimizer, no custom headers, and the repo-name
 * basePath that Pages serves from. Vercel builds leave this unset and keep the
 * default server-rendered path, so ISR and the API routes stay live there.
 */
const isPagesExport = IS_PAGES_EXPORT
const pagesBasePath = PAGES_BASE_PATH

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  ...(isPagesExport && { output: 'export' }),
  ...(pagesBasePath && { basePath: pagesBasePath, assetPrefix: pagesBasePath }),

  // Icon and animation packages ship hundreds of modules; import only what is used.
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'motion/react'],
  },

  // Static assets served from /_next are immutable; HTML is revalidated at the edge.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
    formats: ['image/avif', 'image/webp'],
    // No optimizer on Pages: remote images ship as-is.
    ...(isPagesExport && { unoptimized: true }),
  },

  async headers() {
    // Custom headers need a server. Pages serves plain static files.
    if (isPagesExport) return []
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withAnalyzer(nextConfig)
