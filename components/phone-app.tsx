'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  BatteryHigh,
  CellSignalHigh,
  Check,
  Circle,
  Sparkle,
  WifiHigh,
} from '@phosphor-icons/react'
import { formatEntryDate, getSkillEntries } from '@/lib/registry'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'
import { CopyButton } from '@/components/copy-button'

type Screen = 'feed' | 'detail' | 'run'

interface PhoneAppProps {
  /** Skill the detail and run screens open. */
  initialSlug?: string
  className?: string
}

const RUN_STEPS = [
  'Fetch skill.md from the registry',
  'Verify checksum',
  'Write to ~/.wow/skills',
  'Register trigger phrases',
] as const

const STEP_MS = 420

/** The skill subset of the registry, in catalog order. */
const catalog = getSkillEntries()

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function subscribeToClock(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 20000)
  return () => window.clearInterval(id)
}

/**
 * Real device clock, refreshed every 20 seconds.
 *
 * Subscribes to an interval through useSyncExternalStore instead of writing
 * state from inside an effect. The server snapshot is the static value, so
 * hydration matches and the clock corrects itself right after mount.
 */
function useDeviceClock(): string {
  const read = useCallback(() => formatClock(new Date()), [])
  return useSyncExternalStore(subscribeToClock, read, () => '9:41')
}

/**
 * A real mini-app rendered from the real catalog: search, open, and "install"
 * a skill inside the phone. Not a screenshot and not a mockup: every row,
 * count, and command comes from `content/registry.ts`. The install sequence is a
 * timed demo of what the CLI prints.
 */
export function PhoneApp({ initialSlug, className }: PhoneAppProps) {
  const reduce = useReducedMotion()
  const [screen, setScreen] = useState<Screen>('feed')
  const [direction, setDirection] = useState(1)
  const [activeSlug, setActiveSlug] = useState(initialSlug ?? catalog[0].slug)
  const [query, setQuery] = useState('')
  const [step, setStep] = useState(0)
  const timer = useRef<ReturnType<typeof window.setInterval> | null>(null)

  const clock = useDeviceClock()
  const active = catalog.find((skill) => skill.slug === activeSlug) ?? catalog[0]

  const filtered = catalog.filter((skill) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      skill.name.toLowerCase().includes(q) ||
      skill.tagline.toLowerCase().includes(q) ||
      skill.craft.toLowerCase().includes(q)
    )
  })

  function subscribeToClock(onStoreChange: () => void) {
    const id = window.setInterval(onStoreChange, 20000)
    return () => window.clearInterval(id)
  }

  /**
   * Real device clock, refreshed every 20 seconds.
   *
   * Subscribes to an interval through useSyncExternalStore rather than writing
   * state from inside an effect. The server snapshot is the static value, so
   * hydration matches and the clock corrects itself right after mount.
   */
  function useDeviceClock(): string {
    const read = useCallback(() => formatClock(new Date()), [])
    return useSyncExternalStore(subscribeToClock, read, () => '9:41')
  }

  const stopRun = useCallback(() => {
    if (timer.current) {
      window.clearInterval(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => stopRun, [stopRun])

  const go = useCallback((next: Screen) => {
    setDirection(next === 'feed' ? -1 : 1)
    setScreen(next)
  }, [])

  const openSkill = useCallback(
    (slug: string) => {
      setActiveSlug(slug)
      go('detail')
    },
    [go],
  )

  const startRun = useCallback(() => {
    stopRun()
    setStep(0)
    go('run')
    if (reduce) {
      setStep(RUN_STEPS.length)
      return
    }
    let current = 0
    timer.current = setInterval(() => {
      current += 1
      setStep(current)
      if (current >= RUN_STEPS.length) stopRun()
    }, STEP_MS)
  }, [go, reduce, stopRun])

  const transition = reduce ? { duration: 0.01 } : { duration: 0.3, ease: [...EASE] as const }

  return (
    <div
      className={cn(
        'border-line bg-surface relative w-[300px] shrink-0 rounded-[2.5rem] border p-3 shadow-[0_40px_120px_-48px_rgba(24,24,27,0.45)]',
        className,
      )}
    >
      <div className="bg-bg relative h-[580px] overflow-hidden rounded-[2rem]">
        {/* Device chrome: the island is hardware, so it stays dark in both modes. */}
        <div className="absolute top-2.5 left-1/2 z-[200] h-5 w-20 -translate-x-1/2 rounded-full bg-zinc-950" />

        <div className="text-ink absolute inset-x-0 top-0 z-[200] flex h-11 items-center justify-between px-6 pt-1 text-[11px] font-semibold">
          <span className="tabular-nums">{clock}</span>
          <span className="flex items-center gap-1">
            <CellSignalHigh weight="fill" className="h-3.5 w-3.5" aria-hidden />
            <WifiHigh weight="fill" className="h-3.5 w-3.5" aria-hidden />
            <BatteryHigh weight="fill" className="h-4 w-4" aria-hidden />
          </span>
        </div>

        <div className="absolute inset-0 pt-11">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={screen}
              initial={reduce ? false : { opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -20 }}
              transition={transition}
              className="absolute inset-0 flex flex-col"
            >
              {screen === 'feed' && (
                <FeedScreen query={query} onQuery={setQuery} skills={filtered} onOpen={openSkill} />
              )}
              {screen === 'detail' && (
                <DetailScreen skill={active} onBack={() => go('feed')} onRun={startRun} />
              )}
              {screen === 'run' && (
                <RunScreen
                  skill={active}
                  step={step}
                  onBack={() => {
                    stopRun()
                    go('detail')
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Home indicator */}
        <div className="bg-ink/25 absolute bottom-1.5 left-1/2 z-[200] h-1 w-28 -translate-x-1/2 rounded-full" />
      </div>
    </div>
  )
}

function FeedScreen({
  skills,
  query,
  onQuery,
  onOpen,
}: {
  skills: typeof catalog
  query: string
  onQuery: (value: string) => void
  onOpen: (slug: string) => void
}) {
  return (
    <>
      <header className="px-5 pt-2 pb-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold tracking-tight">Skills</h3>
          <span className="text-muted font-mono text-[11px]">{skills.length} shown</span>
        </div>
        <div className="relative mt-3">
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search the catalog"
            aria-label="Search skills inside the app"
            spellCheck={false}
            className="border-line bg-elevated text-ink placeholder:text-muted focus:border-accent h-9 w-full rounded-lg border pr-3 pl-3 text-[13px] transition-colors outline-none"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {skills.length === 0 ? (
          <p className="text-muted px-2 py-10 text-center text-[13px]">
            Nothing matches “{query}”.
          </p>
        ) : (
          <ul className="space-y-1">
            {skills.map((skill) => (
              <li key={skill.slug}>
                <button
                  type="button"
                  onClick={() => onOpen(skill.slug)}
                  className="active:bg-elevated flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors"
                >
                  <span className="bg-accent-soft text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl">
                    <Sparkle weight="regular" className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-ink block truncate text-[13px] font-semibold">
                      {skill.name}
                    </span>
                    <span className="text-muted block truncate text-[11px]">{skill.tagline}</span>
                  </span>
                  <span className="text-muted shrink-0 truncate font-mono text-[10px]">
                    {skill.craft}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

function DetailScreen({
  skill,
  onBack,
  onRun,
}: {
  skill: (typeof catalog)[number]
  onBack: () => void
  onRun: () => void
}) {
  return (
    <>
      <header className="flex items-center gap-2 px-4 pt-2 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="text-muted active:bg-elevated flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          aria-label="Back to skills"
        >
          <ArrowLeft weight="regular" className="h-4 w-4" />
        </button>
        <span className="text-ink truncate text-sm font-semibold">{skill.name}</span>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <span className="border-line bg-elevated text-muted rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
          {skill.craft}
        </span>
        <h4 className="mt-3 text-lg leading-tight font-bold tracking-tight">{skill.tagline}</h4>
        <p className="text-muted mt-2 text-[13px] leading-relaxed">{skill.description}</p>

        <p className="mono-label mt-5 text-[10px]">Triggers</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skill.triggers.map((trigger) => (
            <span
              key={trigger}
              className="border-line bg-elevated text-muted rounded-full border px-2.5 py-1 font-mono text-[10px]"
            >
              {trigger}
            </span>
          ))}
        </div>

        <p className="mono-label mt-5 text-[10px]">{skill.commandLabel}</p>
        <div className="border-line bg-elevated mt-2 flex items-center gap-2 rounded-lg border px-3 py-2">
          <code className="text-ink min-w-0 flex-1 truncate font-mono text-[11px]">
            {skill.command}
          </code>
          <CopyButton text={skill.command} />
        </div>

        <button
          type="button"
          onClick={onRun}
          className="bg-accent text-on-accent mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-transform active:scale-[0.98]"
        >
          Run skill
        </button>
        <p className="text-muted mt-3 text-center font-mono text-[10px]">
          updated {formatEntryDate(skill.addedAt)}
        </p>
      </div>
    </>
  )
}

function RunScreen({
  skill,
  step,
  onBack,
}: {
  skill: (typeof catalog)[number]
  step: number
  onBack: () => void
}) {
  const done = step >= RUN_STEPS.length

  return (
    <>
      <header className="flex items-center gap-2 px-4 pt-2 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="text-muted active:bg-elevated flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          aria-label="Back to skill"
        >
          <ArrowLeft weight="regular" className="h-4 w-4" />
        </button>
        <span className="text-ink truncate text-sm font-semibold">Running {skill.name}</span>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <ol className="space-y-4">
          {RUN_STEPS.map((label, index) => {
            const state = index < step ? 'done' : index === step ? 'active' : 'pending'
            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                    state === 'done' && 'border-accent bg-accent text-on-accent',
                    state === 'active' && 'border-accent text-accent',
                    state === 'pending' && 'border-line text-muted',
                  )}
                >
                  {state === 'done' ? (
                    <Check weight="bold" className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Circle weight="fill" className="h-2 w-2" aria-hidden />
                  )}
                </span>
                <span
                  className={cn(
                    'text-[13px]',
                    state === 'pending' ? 'text-muted' : 'text-ink',
                    state === 'active' && 'font-medium',
                  )}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>

        {done && (
          <div className="border-line bg-elevated mt-6 rounded-2xl border p-4">
            <p className="text-ink text-[13px] font-semibold">Installed.</p>
            <p className="text-muted mt-1 text-[11px] leading-relaxed">
              Invoke it in any agent:{' '}
              <code className="text-ink font-mono">wow run {skill.slug}</code>
            </p>
            <div className="mt-3">
              <CopyButton text={`wow run ${skill.slug}`} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
