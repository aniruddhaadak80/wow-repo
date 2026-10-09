'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

const TEXT =
  'Software should feel inevitable. A skill should be one command away from useful. Design taste is a feature, not a garnish. Every pixel earns its place.'

const ACCENT_WORDS = new Set(['inevitable.', 'command', 'taste', 'place.'])

function Word({
  children,
  range,
  progress,
  reduce,
}: {
  children: string
  range: [number, number]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduce: boolean
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const isAccent = ACCENT_WORDS.has(children)

  if (reduce) {
    return (
      <span className={cn('mr-[0.26em] inline-block', isAccent && 'text-accent')}>{children}</span>
    )
  }

  return (
    <motion.span
      style={{ opacity }}
      className={cn('mr-[0.26em] inline-block', isAccent && 'text-accent')}
    >
      {children}
    </motion.span>
  )
}

/**
 * Scroll-driven word reveal. Motivated by storytelling:
 * the manifesto assembles itself as you read down.
 */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  })

  const words = TEXT.split(' ')

  return (
    <section className="container-x border-line border-t py-28 lg:py-40">
      <p
        ref={ref}
        className="max-w-[24ch] text-3xl leading-[1.2] font-medium tracking-tight sm:text-4xl md:text-[3.25rem] md:leading-[1.18]"
      >
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word
              key={`${word}-${i}`}
              range={[start, end]}
              progress={scrollYProgress}
              reduce={!!reduce}
            >
              {word}
            </Word>
          )
        })}
      </p>
    </section>
  )
}
