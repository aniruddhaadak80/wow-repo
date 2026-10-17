import {
  CRAFTS,
  KINDS,
  KIND_META,
  entries,
  type Craft,
  type Kind,
  type RegistryEntry,
} from '@/content/registry'

/**
 * Craft and kind views: the two axes the catalog is organised on, turned into
 * pages you can browse.
 *
 * The registry already knows every entry, its craft, and its kind. This module
 * answers the questions a taxonomy page asks: how many, which ones, what does
 * this corner of the catalog have in common, and what should it link to next.
 * Nothing here is typed by hand; change the catalog and the pages follow.
 */

export interface TriggerCount {
  trigger: string
  count: number
}

/** The triggers that appear most often in a pool of entries. */
export function countTriggers(pool: RegistryEntry[], count = 6): TriggerCount[] {
  const counts = new Map<string, number>()
  for (const entry of pool) {
    for (const trigger of entry.triggers) {
      counts.set(trigger, (counts.get(trigger) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([trigger, total]) => ({ trigger, count: total }))
    .sort((a, b) => b.count - a.count || a.trigger.localeCompare(b.trigger))
    .slice(0, count)
}

function newestOf(pool: RegistryEntry[]): RegistryEntry | null {
  return pool.reduce<RegistryEntry | null>(
    (best, entry) => (best === null || entry.addedAt > best.addedAt ? entry : best),
    null,
  )
}

function byName(a: RegistryEntry, b: RegistryEntry): number {
  return a.name.localeCompare(b.name)
}

function zeroByKind(): Record<Kind, number> {
  return Object.fromEntries(KINDS.map((kind) => [kind, 0])) as Record<Kind, number>
}

function zeroByCraft(): Record<Craft, number> {
  return Object.fromEntries(CRAFTS.map((craft) => [craft, 0])) as Record<Craft, number>
}

export interface CraftView {
  craft: Craft
  count: number
  entries: RegistryEntry[]
  byKind: Record<Kind, number>
  topTriggers: TriggerCount[]
  newest: RegistryEntry | null
}

export function getCraftView(craft: Craft): CraftView {
  const pool = entries.filter((entry) => entry.craft === craft)
  const byKind = zeroByKind()
  for (const entry of pool) byKind[entry.kind] += 1
  return {
    craft,
    count: pool.length,
    entries: [...pool].sort(byName),
    byKind,
    topTriggers: countTriggers(pool),
    newest: newestOf(pool),
  }
}

/** Every craft, busiest first. */
export function getCraftViews(): CraftView[] {
  return CRAFTS.map((craft) => getCraftView(craft)).sort(
    (a, b) => b.count - a.count || a.craft.localeCompare(b.craft),
  )
}

export interface KindView {
  kind: Kind
  label: string
  blurb: string
  count: number
  entries: RegistryEntry[]
  byCraft: Record<Craft, number>
  topTriggers: TriggerCount[]
  newest: RegistryEntry | null
}

export function getKindView(kind: Kind): KindView {
  const pool = entries.filter((entry) => entry.kind === kind)
  const byCraft = zeroByCraft()
  for (const entry of pool) byCraft[entry.craft] += 1
  return {
    kind,
    label: KIND_META[kind].label,
    blurb: KIND_META[kind].blurb,
    count: pool.length,
    entries: [...pool].sort(byName),
    byCraft,
    topTriggers: countTriggers(pool),
    newest: newestOf(pool),
  }
}

/** Every kind, busiest first. */
export function getKindViews(): KindView[] {
  return KINDS.map((kind) => getKindView(kind)).sort(
    (a, b) => b.count - a.count || a.kind.localeCompare(b.kind),
  )
}

/** How many triggers two pools share, the honest measure of "related". */
function overlap(a: RegistryEntry[], b: RegistryEntry[]): number {
  const set = new Set(a.flatMap((entry) => entry.triggers))
  return b.reduce((total, entry) => total + entry.triggers.filter((t) => set.has(t)).length, 0)
}

/** Crafts that share the most triggers with this one, so pages cross-link honestly. */
export function getRelatedCrafts(craft: Craft, count = 2): Craft[] {
  const own = entries.filter((entry) => entry.craft === craft)
  return CRAFTS.filter((other) => other !== craft)
    .map((other) => ({
      craft: other,
      score: overlap(
        own,
        entries.filter((entry) => entry.craft === other),
      ),
    }))
    .sort((a, b) => b.score - a.score || a.craft.localeCompare(b.craft))
    .slice(0, count)
    .map((row) => row.craft)
}

/** Kinds that share the most triggers with this one. */
export function getRelatedKinds(kind: Kind, count = 3): Kind[] {
  const own = entries.filter((entry) => entry.kind === kind)
  return KINDS.filter((other) => other !== kind)
    .map((other) => ({
      kind: other,
      score: overlap(
        own,
        entries.filter((entry) => entry.kind === other),
      ),
    }))
    .sort((a, b) => b.score - a.score || a.kind.localeCompare(b.kind))
    .slice(0, count)
    .map((row) => row.kind)
}
