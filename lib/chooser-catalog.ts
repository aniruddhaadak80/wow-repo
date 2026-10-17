import { CRAFTS, KIND_META, KINDS, entries } from '@/content/registry'
import type { ChooserEntry } from '@/lib/chooser'

/**
 * The registry-backed half of the chooser, kept separate on purpose.
 *
 * The recommendation engine in `chooser.ts` is pure so the client island can
 * import it without the catalog. These helpers touch the real registry and are
 * only ever called from a Server Component.
 */

/** The compact catalog handed to the client island, with only the fields it reads. */
export function getChooserCatalog(): ChooserEntry[] {
  return entries.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    kind: entry.kind,
    kindLabel: KIND_META[entry.kind].label,
    craft: entry.craft,
    tagline: entry.tagline,
    command: entry.command,
    license: entry.license,
    featured: entry.featured,
  }))
}

/** Every craft and kind the chooser can offer, so the UI never invents options. */
export function getChooserOptions() {
  return { crafts: CRAFTS, kinds: KINDS }
}
