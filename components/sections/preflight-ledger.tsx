'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'
import { RULE_GROUPS, RULE_COUNT } from '@/content/preflight'

type Filter = 'all' | (typeof RULE_GROUPS)[number]['id']

export function PreflightLedger() {
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState<Filter>('all')

  const groups = useMemo(
    () => (filter === 'all' ? RULE_GROUPS : RULE_GROUPS.filter((group) => group.id === filter)),
    [filter],
  )

  const shown = groups.flatMap((group) => group.rules).length

  return (
    <section
      id="preflight"
      className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32"
    >
      <h2 className="max-w-[22ch] text-4xl font-bold tracking-tighter sm:text-5xl">
        The design system, written down.
      </h2>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        This site is built against a checklist. Every rule below is enforced in the repository and
        names the file that carries it. If a rule stops being true, the row gets deleted.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter rules by craft">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterChip>
          {RULE_GROUPS.map((group) => (
            <FilterChip
              key={group.id}
              active={filter === group.id}
              onClick={() => setFilter(group.id)}
            >
              {group.label}
            </FilterChip>
          ))}
        </div>
        <p className="mono-label" aria-live="polite">
          {shown} of {RULE_COUNT} rules shown
        </p>
      </div>

      <motion.div layout={!reduce} className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {groups.map((group) => (
            <motion.section
              key={group.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [...EASE] }}
            >
              <div className="border-line border-t pt-4">
                <h3 className="flex items-baseline justify-between gap-4 text-lg font-semibold tracking-tight">
                  {group.label}
                  <span className="mono-label shrink-0">{group.rules.length} rules</span>
                </h3>
                <p className="text-muted mt-1 text-sm leading-relaxed">{group.summary}</p>
              </div>

              <ul className="mt-5 space-y-4">
                {group.rules.map((rule) => (
                  <li key={rule.id} className="flex gap-3">
                    <Check
                      weight="bold"
                      aria-hidden="true"
                      className="text-accent mt-0.5 h-4 w-4 shrink-0"
                    />
                    <div>
                      <p className="text-ink text-sm leading-relaxed">{rule.rule}</p>
                      <p className="mono-label mt-0.5">{rule.where}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-9 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
        active
          ? 'border-accent bg-accent text-on-accent'
          : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
