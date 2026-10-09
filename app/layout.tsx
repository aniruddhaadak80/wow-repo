import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { PaletteProvider } from '@/components/palette-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { CommandPalette } from '@/components/command-palette'
import { MobileTabBar } from '@/components/mobile-tab-bar'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SITE_URL } from '@/lib/constants'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const DESCRIPTION =
  'A production-ready Next.js showcase of curated agent skills: installable capabilities for coding, design, research, and content.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'wow-repo: agent skills that ship, sites that wow.',
    template: '%s | wow-repo',
  },
  description: DESCRIPTION,
  applicationName: 'wow-repo',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'wow-repo',
    locale: 'en_US',
    title: 'wow-repo: agent skills that ship, sites that wow.',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'wow-repo: agent skills that ship, sites that wow.',
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'wow-repo',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0c' },
  ],
  colorScheme: 'light dark',
  // Cover the full screen, safe areas included, once installed as an app.
  viewportFit: 'cover',
}

/**
 * Runs before first paint to avoid a theme flash. Kept in sync with
 * `getSnapshot` in theme-provider.tsx.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('wow-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-[100dvh]`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <PaletteProvider>
            <a
              href="#main"
              className="focus:bg-accent focus:text-on-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[400] focus:rounded-full focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold"
            >
              Skip to content
            </a>
            <div className="flex min-h-[100dvh] flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
              <Nav />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <MobileTabBar />
            <CommandPalette />
            <Analytics />
            <SpeedInsights />
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
