'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { EASE, Z } from '@/lib/constants'

/**
 * Reading progress and a way back to the top.
 *
 * The bar tracks how far down the document you are, which is the one piece
 * of page state that is genuinely useful while reading a long entry. The
 * button appears only once you have somewhere to go back to. Both animate
 * with transform and opacity only, and the scroll jump respects reduced
 * motion.
 */
export function BackToTop() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
      setProgress(ratio)
      setVisible(window.scrollY > 600)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <div
        className="bg-accent pointer-events-none fixed top-0 left-0 h-0.5 w-full origin-left"
        style={{ transform: `scaleX(${progress})`, zIndex: Z.sticky }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' })}
        aria-label="Back to top"
        style={{ zIndex: Z.dropdown, transitionTimingFunction: `cubic-bezier(${EASE.join(',')})` }}
        className={cn(
          'border-line bg-surface text-muted hover:text-ink hover:border-ink/30 fixed right-5 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition-all duration-200 md:bottom-8',
          visible ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        <ArrowUp weight="regular" className="h-4 w-4" aria-hidden />
      </button>
    </>
  )
}
