'use client'

import { useEffect, useState } from 'react'
import { Check, DownloadSimple, Info } from '@phosphor-icons/react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function getPromptEvent(): BeforeInstallPromptEvent | null {
  if (typeof window === 'undefined') return null
  return (
    (window as unknown as { __wowInstallPrompt?: BeforeInstallPromptEvent }).__wowInstallPrompt ??
    null
  )
}

/**
 * The download CTA for the PWA. Uses the real install prompt when the browser
 * offers one, and falls back to per-platform instructions when it does not
 * (iOS Safari never fires beforeinstallprompt). State after install is honest:
 * the button reports "Installed" and stops asking.
 */
export function InstallAppButton() {
  const [available, setAvailable] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault()
      ;(window as unknown as { __wowInstallPrompt?: BeforeInstallPromptEvent }).__wowInstallPrompt =
        event as BeforeInstallPromptEvent
      setAvailable(true)
    }
    const onInstalled = () => {
      setInstalled(true)
      setAvailable(false)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) {
    return (
      <span className="border-accent text-accent flex h-12 items-center gap-2 rounded-full border px-7 text-sm font-semibold">
        <Check weight="bold" className="h-4 w-4" />
        Installed
      </span>
    )
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={async () => {
          const prompt = getPromptEvent()
          if (!prompt) {
            setShowHint(true)
            return
          }
          await prompt.prompt()
          const choice = await prompt.userChoice
          if (choice.outcome === 'accepted') setInstalled(true)
        }}
        className="bg-accent text-on-accent flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
      >
        <DownloadSimple weight="regular" className="h-4 w-4" />
        Install app
      </button>

      {showHint && (
        <p className="text-muted flex items-start gap-2 text-sm">
          <Info weight="regular" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Your browser did not offer an install prompt. Use its menu: “Add to Home Screen” (iOS
            Safari) or “Install app” (Android Chrome).
          </span>
        </p>
      )}

      {available && !showHint && (
        <p className="mono-label">Ready to install. Nothing is downloaded from a store.</p>
      )}
    </div>
  )
}
