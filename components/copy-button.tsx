'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // clipboard API unavailable (permissions, iframe): no-op
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-xs transition-colors',
        copied ? 'bg-accent text-on-accent' : 'bg-elevated text-muted hover:text-ink',
      )}
      aria-live="polite"
      aria-label={copied ? 'Copied to clipboard' : `Copy ${text}`}
    >
      {copied ? (
        <Check weight="regular" className="h-3.5 w-3.5" />
      ) : (
        <Copy weight="regular" className="h-3.5 w-3.5" />
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
