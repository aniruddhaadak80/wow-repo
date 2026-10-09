'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { Command, GithubLogo, MagnifyingGlass, List, Moon, Sun, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { GITHUB_URL, Z, EASE } from '@/lib/constants'
import { usePalette } from '@/components/palette-provider'
import { useTheme } from '@/components/theme-provider'

const NAV_LINKS = [
  { label: 'Browse the registry', href: '/skills' },
  { label: 'Frontier log', href: '/discoveries' },
  { label: 'Benchmarks', href: '/#benchmarks' },
  { label: 'How it works', href: '/#how' },
  { label: 'Contribute', href: '/#contribute' },
] as const

export function Nav() {
  const { setOpen: openPalette } = usePalette()
  const { theme, toggle: toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled(value > 8)
  })

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openPalette(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openPalette])

  return (
    <header
      className={cn(
        'sticky top-0 border-b transition-colors duration-300',
        scrolled ? 'border-line bg-bg/80 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
      style={{ zIndex: Z.sticky }}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="wow-repo home">
          <span className="bg-accent text-on-accent flex h-7 w-7 items-center justify-center rounded-lg font-mono text-sm font-bold">
            w
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            wow<span className="text-accent">*</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted hover:text-ink text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openPalette(true)}
            className="border-line bg-surface text-muted hover:border-ink/30 hover:text-ink hidden h-9 items-center gap-2.5 rounded-full border pr-1.5 pl-3 text-sm transition-colors sm:flex"
            aria-label="Search skills"
          >
            <MagnifyingGlass weight="regular" className="h-4 w-4" />
            <span>Search</span>
            <span className="kbd flex items-center gap-0.5">
              <Command className="h-3 w-3" />K
            </span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="border-line bg-surface text-muted hover:border-ink/30 hover:text-ink flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun weight="regular" className="h-4 w-4" />
            ) : (
              <Moon weight="regular" className="h-4 w-4" />
            )}
          </button>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="border-line bg-surface text-muted hover:border-ink/30 hover:text-ink hidden h-9 w-9 items-center justify-center rounded-full border transition-colors sm:flex"
            aria-label="Open GitHub repository"
          >
            <GithubLogo weight="regular" className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="border-line bg-surface text-muted hover:border-ink/30 hover:text-ink flex h-9 w-9 items-center justify-center rounded-full border transition-colors lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X weight="regular" className="h-4 w-4" />
            ) : (
              <List weight="regular" className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [...EASE] }}
            className="border-line bg-bg overflow-hidden border-t lg:hidden"
            aria-label="Mobile"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-muted hover:bg-elevated hover:text-ink rounded-lg px-3 py-2.5 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  openPalette(true)
                }}
                className="text-muted hover:bg-elevated hover:text-ink flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
              >
                <MagnifyingGlass weight="regular" className="h-4 w-4" />
                Search skills
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
