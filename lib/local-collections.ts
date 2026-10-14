/**
 * A tiny localStorage-backed store that any component can read and write.
 *
 * Why not useState plus an effect: the rule that keeps this repo's effects
 * honest forbids syncing React state inside an effect, and the data here
 * genuinely lives outside React. So components subscribe through
 * useSyncExternalStore, and every write broadcasts so mounted views re-read.
 *
 * Reads go straight to localStorage rather than through a module cache. That
 * matters: a cache goes stale the moment anything else clears or edits the
 * key, including a user clearing site data. The snapshots callers hand to
 * useSyncExternalStore are strings (a joined list, a count, a flag), and
 * strings compare by value, so React still sees a stable snapshot without
 * the cache.
 *
 * Nothing touches `window` at import time, so server components can import
 * this module safely and the static export renders the empty state.
 */

const listeners = new Set<() => void>()

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/** Called by useSyncExternalStore to be told when the stored value changes. */
export function subscribeLocalList(callback: () => void): () => void {
  if (!isBrowser()) return () => {}
  listeners.add(callback)
  // Another tab wrote to storage: notify this tab's subscribers too.
  const onStorage = () => callback()
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

/** Server snapshot. Always empty, so hydration matches and Pages exports. */
export function getServerList(): string[] {
  return []
}

export function readLocalList(key: string): string[] {
  if (!isBrowser()) return []
  const raw = window.localStorage.getItem(key)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((value): value is string => typeof value === 'string')
  } catch {
    return []
  }
}

export function writeLocalList(key: string, next: string[]): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // Private mode or a full quota: nothing else to do but move on.
  }
  for (const listener of listeners) listener()
}

/** Adds a value to the front, de-duplicated and capped. */
export function pushLocalList(key: string, value: string, limit = 8): string[] {
  const next = [value, ...readLocalList(key).filter((item) => item !== value)].slice(0, limit)
  writeLocalList(key, next)
  return next
}

/** Toggles membership, keeping insertion order for the add case. */
export function toggleLocalList(key: string, value: string, limit = 64): string[] {
  const current = readLocalList(key)
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value].slice(-limit)
  writeLocalList(key, next)
  return next
}
