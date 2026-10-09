'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  Books,
  Check,
  MagnifyingGlass,
  Moon,
  Package,
  Sun,
} from '@phosphor-icons/react'
import { EASE, GITHUB_URL, Z } from '@/lib/constants'
import { KIND_META } from '@/content/registry'
import { queryEntries } from '@/lib/registry'
import { usePalette } from '@/components/palette-provider'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/cn'

interface PaletteAction {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
  run: () => void
}

/**
 * The overlay. The panel mounts only while open, so its
 * query and selection state initialize fresh per open and
 * no reset effects are needed.
 */
export function CommandPalette() {
  const { open, setOpen } = usePalette()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm"
          style={{ zIndex: Z.modal }}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [...EASE] }}
            className="border-line bg-surface mx-auto mt-[12vh] w-[min(92vw,640px)] overflow-hidden rounded-2xl border shadow-[0_32px_120px_-32px_rgba(0,0,0,0.45)]"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(event) => event.stopPropagation()}
          >
            <PalettePanel />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PalettePanel() {
  const { setOpen } = usePalette()
  const { theme, toggle: toggleTheme } = useTheme()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const actions: PaletteAction[] = useMemo(
    () => [
      {
        id: 'action-explore',
        label: 'Browse the registry',
        hint: 'Page',
        icon: <Package weight="regular" className="h-4 w-4" />,
        run: () => router.push('/skills'),
      },
      {
        id: 'action-frontier',
        label: 'Frontier log',
        hint: 'Page',
        icon: <Books weight="regular" className="h-4 w-4" />,
        run: () => router.push('/discoveries'),
      },
      {
        id: 'action-theme',
        label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        hint: 'Theme',
        icon:
          theme === 'dark' ? (
            <Sun weight="regular" className="h-4 w-4" />
          ) : (
            <Moon weight="regular" className="h-4 w-4" />
          ),
        run: () => toggleTheme(),
      },
      {
        id: 'action-github',
        label: 'Open GitHub repository',
        hint: 'Link',
        icon: <ArrowUpRight weight="regular" className="h-4 w-4" />,
        run: () => window.open(GITHUB_URL, '_blank', 'noreferrer'),
      },
    ],
    [theme, toggleTheme, router],
  )

  const filteredActions = useMemo(
    () =>
      actions.filter((action) => action.label.toLowerCase().includes(query.trim().toLowerCase())),
    [actions, query],
  )

  const filteredSkills = useMemo(
    () =>
      queryEntries({ q: query })
        .filter((entry) => entry.kind === 'skill')
        .slice(0, 7),
    [query],
  )

  const totalResults = filteredActions.length + filteredSkills.length

  // DOM sync only: keep the active row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((i) => (i + 1) % Math.max(totalResults, 1))
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((i) => (i - 1 + Math.max(totalResults, 1)) % Math.max(totalResults, 1))
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        if (totalResults === 0) return
        const actionIndex = filteredActions.length
        if (activeIndex < actionIndex) {
          filteredActions[activeIndex].run()
        } else {
          const skill = filteredSkills[activeIndex - actionIndex]
          if (skill) router.push(`/skills/${skill.slug}`)
        }
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, totalResults, filteredActions, filteredSkills, router, setOpen])

  return (
    <>
      <div className="border-line flex items-center gap-3 border-b px-4">
        <MagnifyingGlass weight="regular" className="text-muted h-4 w-4" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          placeholder="Search skills, or type a command"
          className="text-ink placeholder:text-muted h-13 w-full bg-transparent py-4 text-sm outline-none"
          aria-label="Search skills"
        />
        <span className="kbd">esc</span>
      </div>

      <ul ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
        {totalResults === 0 && (
          <li className="text-muted px-3 py-8 text-center text-sm">
            No matches for “{query}”. Try a craft, like “design”.
          </li>
        )}

        {filteredActions.length > 0 && (
          <li className="mono-label px-3 pt-2 pb-1" aria-hidden="true">
            Actions
          </li>
        )}
        {filteredActions.map((action, i) => {
          const current = i
          return (
            <li key={action.id}>
              <button
                type="button"
                data-index={current}
                onMouseEnter={() => setActiveIndex(current)}
                onClick={() => {
                  action.run()
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                  current === activeIndex ? 'bg-elevated text-ink' : 'text-muted',
                )}
              >
                <span className="text-muted">{action.icon}</span>
                <span className="flex-1">{action.label}</span>
                <span className="mono-label">{action.hint}</span>
              </button>
            </li>
          )
        })}

        {filteredSkills.length > 0 && (
          <li className="mono-label px-3 pt-3 pb-1" aria-hidden="true">
            Registry
          </li>
        )}
        {filteredSkills.map((skill, i) => {
          const current = filteredActions.length + i
          return (
            <li key={skill.slug}>
              <button
                type="button"
                data-index={current}
                onMouseEnter={() => setActiveIndex(current)}
                onClick={() => {
                  router.push(`/skills/${skill.slug}`)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                  current === activeIndex ? 'bg-elevated text-ink' : 'text-muted',
                )}
              >
                <span className="bg-accent-soft text-accent flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-semibold">
                  {skill.name.charAt(0)}
                </span>
                <span className="flex-1">
                  <span className="text-ink block font-medium">{skill.name}</span>
                  <span className="text-muted block truncate text-xs">{skill.tagline}</span>
                </span>
                <span className="mono-label shrink-0">{KIND_META[skill.kind].label}</span>
                {current === activeIndex && (
                  <Check weight="regular" className="text-accent h-4 w-4" />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="border-line flex items-center gap-4 border-t px-4 py-2.5">
        <span className="mono-label flex items-center gap-1.5">
          <span className="kbd">↑↓</span> navigate
        </span>
        <span className="mono-label flex items-center gap-1.5">
          <span className="kbd">↵</span> open
        </span>
        <span className="mono-label ml-auto">{totalResults} results</span>
      </div>
    </>
  )
}
