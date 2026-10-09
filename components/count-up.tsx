'use client'

import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { EASE } from '@/lib/constants'

interface CountUpProps {
  value: number
  /** Decimal places to render. `1.2` renders as `1.20`. */
  decimals?: number
  prefix?: string
  suffix?: string
  /** Duration in seconds. Long enough to read, short enough to feel snappy. */
  duration?: number
}

/**
 * Counts from zero to `value` the first time the element scrolls into view.
 *
 * Hydration contract: the server and the first client paint both render the
 * zero state (or the final value under reduced motion), so there is no
 * text-node mismatch. The motion value only mounts once `inView` flips true
 * in an effect, which is past hydration.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })

  // `useReducedMotion` reports null on the server and on the first client
  // paint, then the real preference once mounted. Deriving from it keeps the
  // hydration contract: server and first paint both render the zero state.
  const settled = reduce === true
  const active = inView && reduce === false
  const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`

  return (
    <span ref={ref} className="tabular-nums">
      {active ? (
        <AnimatedNumber value={value} duration={duration} format={format} />
      ) : (
        format(settled ? value : 0)
      )}
    </span>
  )
}

function AnimatedNumber({
  value,
  duration,
  format,
}: {
  value: number
  duration: number
  format: (n: number) => string
}) {
  const count = useMotionValue(0)
  const text = useTransform(count, format)

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: [...EASE] })
    return () => controls.stop()
  }, [count, value, duration])

  return <motion.span>{text}</motion.span>
}
