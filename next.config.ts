import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  // Icon and animation packages ship hundreds of modules; import only what is used.
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'motion/react'],
  },

  // Static assets served from /_next are immutable; HTML is revalidated at the edge.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default withAnalyzer(nextConfig)
