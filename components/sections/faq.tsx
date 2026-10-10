'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Minus, Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/constants'

const QUESTIONS = [
  {
    q: 'Is this a real repository or a demo?',
    a: 'A real repository. The catalog, the search, the command palette, and the rules ledger all run against typed content modules in content/. The install commands stay samples until you wire them to your own registry.',
  },
  {
    q: 'Why no component library?',
    a: 'Every interactive piece here is owned code: the palette, the filters, this accordion. That keeps the bundle small and the accessibility audit short. Swapping in Radix or shadcn later is a contained change, not a rewrite.',
  },
  {
    q: 'Does it need a backend?',
    a: 'No. The build output is static HTML plus two JSON routes. The only outbound requests the page makes are for images, and every catalog read happens at build time.',
  },
  {
    q: 'How do I change the accent color?',
    a: 'One token per mode in app/globals.css. --accent and --on-accent are defined once, and every button, chip, focus ring, and selection color reads from them.',
  },
  {
    q: 'What does CI run?',
    a: 'Typecheck, ESLint, Prettier, Vitest, and a production build. Running bun run check locally runs the same sequence in the same order.',
  },
] as const

export function Faq() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="min-w-0">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Questions worth answering.
          </h2>
          <p className="text-muted mt-5 max-w-[38ch] text-lg leading-relaxed">
            The five things a maintainer asks before forking a template.
          </p>
        </div>

        <ul className="border-line border-t">
          {QUESTIONS.map((item, index) => {
            const isOpen = open === index
            return (
              <li key={item.q} className="border-line border-b">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-ink text-lg font-medium tracking-tight">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'border-line flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                        isOpen ? 'border-accent text-accent' : 'text-muted',
                      )}
                    >
                      {isOpen ? (
                        <Minus weight="bold" className="h-3.5 w-3.5" />
                      ) : (
                        <Plus weight="bold" className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${index}`}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [...EASE] }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted max-w-[62ch] pr-12 pb-6 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
