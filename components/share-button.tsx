'use client'

import { useState } from 'react'
import { ShareNetwork, Check } from '@phosphor-icons/react'
import { SITE_URL } from '@/lib/constants'

/**
 * Share a registry entry. Uses the Web Share API when the platform has it
 * (phones, mostly) and falls back to copying the link, because a share
 * button that silently does nothing is worse than no share button.
 */
export function ShareButton({ path, title }: { path: string; title: string }) {
  const [state, setState] = useState<'idle' | 'shared' | 'copied'>('idle')
  const url = `${SITE_URL}${path}`

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        setState('shared')
        return
      } catch {
        // Cancelled or unsupported payload: fall through to the copy path.
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setState('copied')
    } catch {
      setState('idle')
      return
    }
    window.setTimeout(() => setState('idle'), 2000)
  }

  const label =
    state === 'copied' ? 'Link copied' : state === 'shared' ? 'Shared' : 'Copy share link'

  return (
    <button
      type="button"
      onClick={share}
      className="border-line bg-surface text-muted hover:text-ink hover:border-ink/30 inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-colors active:scale-[0.97]"
    >
      {state === 'idle' ? (
        <ShareNetwork weight="regular" className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Check weight="regular" className="text-accent h-3.5 w-3.5" aria-hidden />
      )}
      <span aria-live="polite">{label}</span>
    </button>
  )
}
