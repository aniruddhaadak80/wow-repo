'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GithubLogo, House, MagnifyingGlass, Sparkle } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { GITHUB_URL, Z } from '@/lib/constants'
import { usePalette } from '@/components/palette-provider'

interface Tab {
  label: string
  href: string | null
  icon: typeof House
  match: (path: string) => boolean
  external?: boolean
}

const TABS: Tab[] = [
  { label: 'Home', href: '/', icon: House, match: (path) => path === '/' },
  {
    label: 'Skills',
    href: '/skills',
    icon: Sparkle,
    match: (path) => path.startsWith('/skills'),
  },
  { label: 'Search', href: null, icon: MagnifyingGlass, match: () => false },
  {
    label: 'GitHub',
    href: GITHUB_URL,
    icon: GithubLogo,
    match: () => false,
    external: true,
  },
]

/**
 * Bottom tab bar, mobile only. App chrome: thumb-reachable navigation, 64px
 * targets, and a safe-area pad so the iOS home indicator never overlaps a
 * label. Desktop keeps the top nav; the bar hides at md and up.
 */
export function MobileTabBar() {
  const pathname = usePathname()
  const { setOpen: openPalette } = usePalette()

  return (
    <nav
      aria-label="Primary, mobile"
      className="border-line bg-bg/90 fixed inset-x-0 bottom-0 border-t backdrop-blur-md md:hidden"
      style={{ zIndex: Z.sticky, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex h-16 items-stretch">
        {TABS.map((tab) => {
          const active = tab.match(pathname)
          const icon = <tab.icon weight="regular" className="h-5 w-5" aria-hidden />

          return (
            <li key={tab.label} className="flex-1">
              {tab.href === null ? (
                <button
                  type="button"
                  onClick={() => openPalette(true)}
                  className="text-muted flex h-full w-full flex-col items-center justify-center gap-1 transition-colors active:scale-95"
                >
                  {icon}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              ) : (
                <Link
                  href={tab.href}
                  {...(tab.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-full w-full flex-col items-center justify-center gap-1 transition-colors active:scale-95',
                    active ? 'text-accent' : 'text-muted',
                  )}
                >
                  {icon}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
