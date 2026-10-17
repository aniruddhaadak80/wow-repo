'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CopyButton } from '@/components/copy-button'
import {
  CHOOSER_GOALS,
  buildSetupScript,
  buildStackMarkdown,
  recommendStack,
  type ChooserEntry,
  type ChooserGoal,
} from '@/lib/chooser'
import type { Craft, Kind } from '@/content/registry'

/**
 * The stack chooser. It scores the slim catalog that the page hands it, using
 * the pure engine in `lib/chooser`, and shows the reasons behind every pick.
 * Nothing here is a black box, and nothing here imports the registry.
 */

interface StackChooserProps {
  catalog: ChooserEntry[]
  /** Readonly because the catalog's craft list is a frozen tuple. */
  crafts: readonly Craft[]
  kindOptions: Array<{ value: Kind; label: string }>
}

const LICENCES: Array<{ value: 'any' | 'open'; label: string }> = [
  { value: 'any', label: 'Any licence' },
  { value: 'open', label: 'Prefer open source' },
]

export function StackChooser({ catalog, crafts, kindOptions }: StackChooserProps) {
  const [goal, setGoal] = useState<ChooserGoal>(CHOOSER_GOALS[0].id)
  const [craft, setCraft] = useState<Craft | null>(null)
  const [kinds, setKinds] = useState<Kind[]>([])
  const [licence, setLicence] = useState<'any' | 'open'>('any')

  const recommendations = useMemo(
    () => recommendStack({ goal, craft, kinds, licence }, 5, catalog),
    [goal, craft, kinds, licence, catalog],
  )

  const toggleKind = (kind: Kind) => {
    setKinds((current) =>
      current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind],
    )
  }

  const reset = () => {
    setGoal(CHOOSER_GOALS[0].id)
    setCraft(null)
    setKinds([])
    setLicence('any')
  }

  return (
    <div className="mt-12">
      <fieldset>
        <legend className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
          1. What are you building?
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHOOSER_GOALS.map((option) => {
            const active = option.id === goal
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => setGoal(option.id)}
                className={`rounded-2xl border p-4 text-left transition-colors duration-200 ${
                  active
                    ? 'border-accent bg-elevated'
                    : 'border-line bg-surface hover:border-ink/25'
                }`}
              >
                <span className="text-ink block font-medium">{option.label}</span>
                <span className="text-muted mt-1 block text-sm leading-relaxed">
                  {option.blurb}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <fieldset>
          <legend className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
            2. Any craft in particular?
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={craft === null}
              onClick={() => setCraft(null)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                craft === null
                  ? 'border-accent text-accent'
                  : 'border-line text-muted hover:text-ink'
              }`}
            >
              Any craft
            </button>
            {crafts.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={craft === option}
                onClick={() => setCraft(option)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  craft === option
                    ? 'border-accent text-accent'
                    : 'border-line text-muted hover:text-ink'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
            3. Which kinds will you run?
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {kindOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={kinds.includes(option.value)}
                onClick={() => toggleKind(option.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  kinds.includes(option.value)
                    ? 'border-accent text-accent'
                    : 'border-line text-muted hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {LICENCES.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={licence === option.value}
                onClick={() => setLicence(option.value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  licence === option.value
                    ? 'border-accent text-accent'
                    : 'border-line text-muted hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-12">
        <div className="border-line flex flex-wrap items-baseline justify-between gap-3 border-b pb-3">
          <h2 className="text-ink text-2xl font-semibold tracking-tight" aria-live="polite">
            {`${recommendations.length} ${recommendations.length === 1 ? 'pick' : 'picks'}`}
          </h2>
          <div className="flex items-center gap-2">
            <CopyButton text={buildSetupScript(recommendations)} label="the setup script" />
            <CopyButton text={buildStackMarkdown(recommendations)} label="the stack as Markdown" />
            <button
              type="button"
              onClick={reset}
              className="text-muted hover:text-ink rounded-full px-3 font-mono text-xs transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-muted mt-6">
            Nothing fits those filters. Loosen a kind or switch the craft back to any.
          </p>
        ) : (
          <ol className="mt-6 space-y-3">
            {recommendations.map(({ entry, score, reasons }) => (
              <li key={entry.slug} className="border-line bg-surface rounded-2xl border p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/skills/${entry.slug}`}
                    className="text-ink text-lg font-medium hover:underline hover:underline-offset-4"
                  >
                    {entry.name}
                  </Link>
                  <span className="text-muted font-mono text-xs tabular-nums">score {score}</span>
                </div>
                <p className="text-muted mt-1 font-mono text-[11px] tracking-[0.12em] uppercase">
                  {entry.kindLabel} · {entry.craft}
                </p>
                <p className="text-ink mt-2 leading-relaxed">{entry.tagline}</p>
                <ul className="text-muted mt-3 space-y-1 text-sm">
                  {reasons.map((reason) => (
                    <li key={reason} className="flex gap-2">
                      <span aria-hidden="true">·</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}

        <p className="text-muted mt-6 text-sm">
          Commands are samples from the demo catalog. Read each one before you run it.
        </p>
      </div>
    </div>
  )
}
