'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Pause, Play, ArrowCounterClockwise } from '@phosphor-icons/react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import type { DemoRun } from '@/content/company'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

const TICK_MS = 60

type ReplayMode = 'idle' | 'running' | 'paused'

export function OrchestrationReplay({ run }: { run: DemoRun }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(containerRef, { once: true, amount: 0.3 })

  const totalMs = run.steps.reduce((sum, step) => sum + step.ms, 0)
  const boundaries = run.steps.map((_, i) =>
    run.steps.slice(0, i).reduce((sum, step) => sum + step.ms, 0),
  )

  const [elapsed, setElapsed] = useState(0)
  const [mode, setMode] = useState<ReplayMode>('idle')

  // Reduced motion collapses the whole replay to its finished state.
  const shown = reduce ? totalMs : elapsed
  const finished = reduce || shown >= totalMs

  // Auto-start the first time the section scrolls into view. A deliberate
  // user choice always beats the auto-start, so nothing is written to state
  // from inside an effect.
  const playing = !reduce && !finished && (mode === 'running' || (mode === 'idle' && inView))

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => {
      setElapsed((value) => Math.min(value + TICK_MS, totalMs))
    }, TICK_MS)
    return () => clearTimeout(timer)
  }, [playing, totalMs])

  const activeIndex = finished
    ? run.steps.length - 1
    : boundaries.findIndex((start, i) => shown < start + run.steps[i].ms)

  const progressWidth = totalMs === 0 ? 0 : (shown / totalMs) * 100

  function jumpTo(index: number) {
    setElapsed(boundaries[index] ?? 0)
    setMode('paused')
  }

  function replay() {
    setElapsed(0)
    setMode('running')
  }

  return (
    <div
      ref={containerRef}
      className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14"
      data-testid="orchestration-replay"
    >
      {/* Event and transport */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="mono-label">Trigger</p>
        <p className="text-ink mt-3 max-w-[34ch] text-xl leading-snug font-medium tracking-tight sm:text-2xl">
          {run.event}
        </p>

        <div className="border-line bg-elevated mt-8 rounded-2xl border p-6">
          <div className="flex items-baseline justify-between">
            <span className="mono-label">Elapsed</span>
            <span className="text-ink font-mono text-3xl tracking-tighter">
              {(shown / 1000).toFixed(1)}s
            </span>
          </div>
          <div className="bg-line mt-4 h-px w-full" aria-hidden="true">
            <div
              className={cn(
                'bg-accent h-px',
                !reduce && 'transition-[width] duration-75 ease-linear',
              )}
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          {!reduce && (
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => (finished ? replay() : setMode(playing ? 'paused' : 'running'))}
                className="bg-accent text-on-accent flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-transform duration-200 active:scale-[0.98]"
                aria-label={
                  playing ? 'Pause the replay' : finished ? 'Replay the run' : 'Play the run'
                }
              >
                {playing ? (
                  <Pause weight="fill" className="h-4 w-4" />
                ) : (
                  <Play weight="fill" className="h-4 w-4" />
                )}
                {playing ? 'Pause' : finished ? 'Replay' : 'Play'}
              </button>
              <button
                type="button"
                onClick={replay}
                className="border-line bg-surface text-muted hover:border-ink/30 hover:text-ink flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                aria-label="Restart the run"
              >
                <ArrowCounterClockwise weight="regular" className="h-4 w-4" />
              </button>
            </div>
          )}
          {reduce && <p className="mono-label mt-6">Motion reduced. Showing the finished run.</p>}
        </div>
      </div>

      {/* Step list */}
      <ol className="relative">
        <span className="bg-line absolute top-3 bottom-3 left-[15px] w-px" aria-hidden="true" />
        {run.steps.map((step, i) => {
          const state = i < activeIndex || finished ? 'done' : i === activeIndex ? 'active' : 'idle'
          return (
            <li key={step.id} className="relative pb-8 pl-11 last:pb-0">
              <span
                className={cn(
                  'absolute top-1 left-0 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-300',
                  state === 'done' && 'border-accent bg-accent text-on-accent',
                  state === 'active' && 'border-accent bg-surface text-accent',
                  state === 'idle' && 'border-line bg-surface text-muted',
                )}
              >
                {state === 'done' ? (
                  <Check weight="bold" className="h-3.5 w-3.5" />
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>

              <motion.button
                type="button"
                onClick={() => jumpTo(i)}
                initial={false}
                whileHover={reduce ? undefined : { x: 3 }}
                transition={{ duration: 0.2, ease: [...EASE] }}
                className="block w-full text-left"
                aria-label={`Jump to step ${i + 1}: ${step.label}`}
              >
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span
                    className={cn(
                      'text-lg font-semibold tracking-tight transition-colors duration-300',
                      state === 'idle' ? 'text-muted' : 'text-ink',
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-xs transition-colors duration-300',
                      state === 'idle' ? 'text-muted' : 'text-accent',
                    )}
                  >
                    {step.agent}
                  </span>
                </span>
                <span
                  className={cn(
                    'mt-1.5 block max-w-[58ch] text-sm leading-relaxed transition-colors duration-300',
                    state === 'idle' ? 'text-muted/70' : 'text-muted',
                  )}
                >
                  {step.does}
                </span>
              </motion.button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
