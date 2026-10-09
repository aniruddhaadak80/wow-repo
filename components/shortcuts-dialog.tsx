'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Command, X } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { EASE, Z } from '@/lib/constants'

interface Shortcut {
  keys: string[]
  label: string
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['Cmd', 'K'], label: 'Open the command palette' },
  { keys: ['/'], label: 'Focus search on the registry page' },
  { keys: ['G', 'S'], label: 'Go to the registry' },
  { keys: ['G', 'C'], label: 'Go to the comparison board' },
  { keys: ['G', 'D'], label: 'Go to the docs' },
  { keys: ['G', 'R'], label: 'Open a random entry' },
  { keys: ['?'], label: 'Show this dialog' },
  { keys: ['Esc'], label: 'Close any overlay' },
]

/**
 * Keyboard shortcuts, both the dialog and the bindings. Pressing ? anywhere
 * that is not a text field opens it. The g-prefixed bindings are the standard
 * vim-ish navigation shortcut, and every one of them is also reachable by
 * pointer, so this is an accelerator and never the only path.
 */
export function ShortcutsDialog() {
  const reduce = useReducedMotion()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let awaitingSecond = false
    let timer = 0

    const isTypingTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return

      if (event.key === 'Escape') {
        setOpen(false)
        return
      }

      if (event.key === '?') {
        event.preventDefault()
        setOpen((value) => !value)
        return
      }

      if (awaitingSecond) {
        awaitingSecond = false
        window.clearTimeout(timer)
        const second = event.key.toLowerCase()
        if (second === 's') router.push('/skills')
        if (second === 'c') router.push('/compare')
        if (second === 'd') router.push('/docs')
        if (second === 'r') router.push('/random')
        return
      }

      if (event.key.toLowerCase() === 'g') {
        awaitingSecond = true
        timer = window.setTimeout(() => {
          awaitingSecond = false
        }, 1200)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [router])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-end justify-center p-4 sm:items-center"
          style={{ zIndex: Z.modal }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.2 }}
        >
          <button
            type="button"
            aria-label="Close shortcuts"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [...EASE] }}
            className="border-line bg-bg relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-[0_40px_120px_-40px_rgba(24,24,27,0.5)]"
          >
            <div className="border-line flex items-center justify-between border-b px-6 py-4">
              <h2 id="shortcuts-title" className="text-ink text-sm font-semibold tracking-tight">
                Keyboard shortcuts
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-ink flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                aria-label="Close shortcuts"
              >
                <X weight="regular" className="h-4 w-4" />
              </button>
            </div>

            <ul className="divide-line divide-y">
              {SHORTCUTS.map((shortcut) => (
                <li
                  key={shortcut.label}
                  className="flex items-center justify-between gap-4 px-6 py-3.5"
                >
                  <span className="text-ink text-sm">{shortcut.label}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="border-line bg-elevated text-muted inline-flex h-6 min-w-6 items-center justify-center rounded-md border px-1.5 font-mono text-[11px]"
                      >
                        {key}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-line border-t px-6 py-4">
              <p className="mono-label flex items-center gap-2">
                <Command weight="regular" className="h-3.5 w-3.5" aria-hidden />
                Every shortcut has a pointer equivalent. Nothing here is the only path.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** The footer trigger, so the shortcuts are discoverable without the hint. */
export function ShortcutsHint({ className }: { className?: string }) {
  return (
    <span className={cn('mono-label inline-flex items-center gap-2', className)}>
      <Command weight="regular" className="h-3.5 w-3.5" aria-hidden />
      Press <span className="kbd">?</span> for shortcuts
    </span>
  )
}
