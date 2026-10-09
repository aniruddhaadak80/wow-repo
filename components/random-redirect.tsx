'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'
import { Shuffle } from '@phosphor-icons/react'
import { getEntries } from '@/lib/registry'

/*
 * Entry roulette, server-free: the page never renders a list, it just lands
 * you somewhere surprising in the registry. The pick is cached in module
 * scope so every read of the store returns the same value (a requirement of
 * useSyncExternalStore) and the same entry is not served twice in a row
 * within a session.
 */
let cachedSlug: string | null = null

function pickSlug(): string {
  if (cachedSlug) return cachedSlug
  const entries = getEntries()
  let index = Math.floor(Math.random() * entries.length)
  const last =
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('wow-random-last') : null
  if (last && entries[index].slug === last && entries.length > 1) {
    index = (index + 1) % entries.length
  }
  cachedSlug = entries[index].slug
  sessionStorage.setItem('wow-random-last', cachedSlug)
  return cachedSlug
}

/** No external changes to observe: the "system" is the cached pick itself. */
function subscribe() {
  return () => {}
}

export function RandomRedirect() {
  const router = useRouter()
  const target = useSyncExternalStore(subscribe, pickSlug, () => null)

  useEffect(() => {
    if (target) router.replace(`/skills/${target}`)
  }, [router, target])

  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="bg-accent-soft text-accent flex h-14 w-14 items-center justify-center rounded-2xl">
        <Shuffle weight="regular" className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="text-ink mt-6 text-3xl font-bold tracking-tighter sm:text-4xl">
        Picking something from the registry.
      </h1>
      <p className="text-muted mt-4 max-w-[42ch] leading-relaxed">
        {target
          ? `Opening /skills/${target}.`
          : 'Choosing at random from every skill, MCP server, API, protocol, harness, and tool.'}
      </p>
    </section>
  )
}
