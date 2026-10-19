import { CRAFTS, KIND_META, KINDS, entries, type Craft, type Kind } from '@/content/registry'

/**
 * The coverage matrix: every kind against every craft.
 *
 * The taxonomy pages answer "what is in this corner". This answers the
 * opposite question, the one a reader actually has before contributing: which
 * corners are empty. A cell count of zero is a gap in the catalog, and a cell
 * with one or two entries is thin enough that a single contribution changes it.
 *
 * Nothing is typed by hand. Add an entry to the catalog and the matrix follows,
 * so the page cannot drift from the data it claims to describe.
 */

export interface CoverageCell {
  kind: Kind
  kindLabel: string
  craft: Craft
  count: number
  /** A few entry names, so a cell is inspectable without leaving the matrix. */
  sample: string[]
}

export interface CoverageRow {
  kind: Kind
  kindLabel: string
  total: number
  cells: Record<Craft, CoverageCell>
}

export interface CoverageMatrix {
  rows: CoverageRow[]
  /** Cells with nothing in them. These are the real gaps. */
  empty: CoverageCell[]
  /** Cells with one or two entries: one contribution changes these. */
  thin: CoverageCell[]
  fullest: CoverageCell
}

function buildCell(kind: Kind, craft: Craft, sampleSize = 2): CoverageCell {
  const pool = entries.filter((entry) => entry.kind === kind && entry.craft === craft)
  return {
    kind,
    kindLabel: KIND_META[kind].label,
    craft,
    count: pool.length,
    sample: pool
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, sampleSize)
      .map((entry) => entry.name),
  }
}

export function getCoverageMatrix(sampleSize = 2): CoverageMatrix {
  const rows: CoverageRow[] = KINDS.map((kind) => {
    const cells = Object.fromEntries(
      CRAFTS.map((craft) => [craft, buildCell(kind, craft, sampleSize)]),
    ) as Record<Craft, CoverageCell>
    return {
      kind,
      kindLabel: KIND_META[kind].label,
      total: KINDS.includes(kind) ? entries.filter((entry) => entry.kind === kind).length : 0,
      cells,
    }
  })

  const all = KINDS.flatMap((kind) => CRAFTS.map((craft) => buildCell(kind, craft, sampleSize)))
  const empty = all.filter((cell) => cell.count === 0)
  const thin = all.filter((cell) => cell.count > 0 && cell.count <= 2)
  const fullest = all.reduce((best, cell) => (cell.count > best.count ? cell : best), all[0])

  return { rows, empty, thin, fullest }
}

/** How far a cell is from the busiest one, as a share of it. Zero is empty. */
export function cellFill(cell: CoverageCell, fullestCount: number): number {
  return fullestCount === 0 ? 0 : cell.count / fullestCount
}
