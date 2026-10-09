'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, Play, Stop } from '@phosphor-icons/react'
import { getEntryBySlug } from '@/lib/registry'
import type { RegistryEntry } from '@/content/registry'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

interface SwarmTask {
  id: string
  label: string
  brief: string
  agentSlugs: string[]
}

/** Tasks map to real skills in the catalog, so the demo runs on real data. */
const TASKS: SwarmTask[] = [
  {
    id: 'audit',
    label: 'Audit a landing page',
    brief:
      'The lead splits the page into surface, metadata, and copy, then assigns each to a specialist.',
    agentSlugs: ['design-taste-frontend', 'seo-auditor', 'copy-edit-pass'],
  },
  {
    id: 'ship',
    label: 'Ship an open-source feature',
    brief:
      'The lead scopes the issue, branches the work, and routes each step to the craft that owns it.',
    agentSlugs: ['oss-ship-kit', 'code-review-cadence', 'thread-writer'],
  },
  {
    id: 'model',
    label: 'Design a schema',
    brief:
      'The lead gathers requirements first, then runs schema review and reporting in parallel.',
    agentSlugs: ['deep-research', 'prisma-schema-mentor', 'data-viz-field-guide'],
  },
]

type Phase = 'idle' | 'running' | 'done'
type WorkerStatus = 'queued' | 'running' | 'done'

const STATUS_LABEL: Record<WorkerStatus, string> = {
  queued: 'queued',
  running: 'running',
  done: 'reported',
}

export function SwarmRunner() {
  const reduce = useReducedMotion()
  const [taskId, setTaskId] = useState(TASKS[0].id)
  const [phase, setPhase] = useState<Phase>('idle')
  const [active, setActive] = useState(-1)
  const [completed, setCompleted] = useState(0)

  const task = useMemo(() => TASKS.find((t) => t.id === taskId) ?? TASKS[0], [taskId])
  const agents = useMemo(
    () =>
      task.agentSlugs
        .map((slug) => getEntryBySlug(slug))
        .filter((entry): entry is RegistryEntry => Boolean(entry)),
    [task],
  )

  const selectTask = (id: string) => {
    setTaskId(id)
    setPhase('idle')
    setActive(-1)
    setCompleted(0)
  }

  const run = useCallback(() => {
    setActive(-1)
    setCompleted(0)
    setPhase('running')
  }, [])

  // Finite state machine: start each worker in sequence, then finish the swarm.
  // Under reduced motion the run is never scheduled; the finished state is
  // derived below instead of written from this effect.
  useEffect(() => {
    if (phase !== 'running' || reduce) return
    const timers: number[] = []
    agents.forEach((_, i) => {
      timers.push(window.setTimeout(() => setActive(i), 250 + i * 320))
      timers.push(window.setTimeout(() => setCompleted((c) => Math.max(c, i + 1)), 850 + i * 320))
    })
    timers.push(window.setTimeout(() => setPhase('done'), 850 + agents.length * 320 + 450))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [phase, agents, reduce])

  // What the UI shows: reduced motion jumps straight to the finished swarm.
  const shownPhase = reduce ? 'done' : phase
  const shownCompleted = reduce ? agents.length : completed

  const statusOf = (index: number): WorkerStatus => {
    if (index < shownCompleted) return 'done'
    if (shownPhase === 'running' && index === active) return 'running'
    return 'queued'
  }

  return (
    <div className="border-line bg-surface rounded-2xl border">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
        <span className="mono-label">swarm runner</span>
        <span className="mono-label" role="status">
          {shownPhase === 'idle' && 'idle'}
          {shownPhase === 'running' && `${shownCompleted} of ${agents.length} reported`}
          {shownPhase === 'done' && `${agents.length} reports filed`}
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Pick a task">
          {TASKS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === task.id}
              onClick={() => selectTask(option.id)}
              className={cn(
                'h-9 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                option.id === task.id
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line bg-bg text-muted hover:border-ink/30 hover:text-ink',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="text-muted mt-5 max-w-[62ch] text-sm leading-relaxed">{task.brief}</p>

        <ul className="border-line mt-6 space-y-0 border-l pl-6">
          <AnimatePresence initial={false}>
            {agents.map((entry, index) => {
              const status = statusOf(index)
              return (
                <motion.li
                  key={entry.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: [...EASE] }}
                  className="relative flex items-center gap-4 py-3.5"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -left-[1.9rem] h-2 w-2 rounded-full transition-colors duration-300',
                      status === 'done' && 'bg-accent',
                      status === 'running' && 'bg-accent',
                      status === 'queued' && 'bg-line',
                    )}
                  />
                  <span className="bg-elevated text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl font-mono text-sm font-semibold">
                    {entry.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/skills/${entry.slug}`}
                      className="text-ink hover:text-accent block truncate text-sm font-medium tracking-tight transition-colors"
                    >
                      {entry.name}
                    </Link>
                    <span className="mono-label">{entry.craft}</span>
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase',
                      status === 'done' && 'border-accent/40 bg-accent-soft text-accent',
                      status === 'running' && 'border-accent text-accent',
                      status === 'queued' && 'border-line text-muted',
                    )}
                  >
                    {status === 'done' && <Check weight="bold" className="h-3 w-3" />}
                    {status === 'running' && (
                      <span className="bg-accent h-1.5 w-1.5 rounded-full motion-safe:animate-pulse" />
                    )}
                    {STATUS_LABEL[status]}
                  </span>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>

        <div className="border-line mt-6 flex flex-wrap items-center gap-3 border-t pt-5">
          {phase === 'running' ? (
            <button
              type="button"
              onClick={() => {
                setPhase('idle')
                setActive(-1)
                setCompleted(0)
              }}
              className="border-line text-ink hover:border-ink/30 flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors active:scale-[0.98]"
            >
              <Stop weight="regular" className="h-4 w-4" />
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={run}
              className="bg-accent text-on-accent flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <Play weight="fill" className="h-4 w-4" />
              {phase === 'done' ? 'Run again' : 'Run swarm'}
            </button>
          )}
          <p className="mono-label max-w-[44ch]" aria-live="polite">
            {phase === 'idle' && 'Pick a task and run the swarm.'}
            {phase === 'running' && 'Agents pick up work as the previous one reports.'}
            {phase === 'done' &&
              'Reports are files in your workspace. Open an agent to read its checklist.'}
          </p>
        </div>
      </div>
    </div>
  )
}
