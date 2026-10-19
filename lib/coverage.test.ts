import { describe, expect, it } from 'vitest'
import { CRAFTS, KINDS, entries } from '@/content/registry'
import { cellFill, getCoverageMatrix } from './coverage'

/*
 * A matrix is only honest if its counts match the catalog it was built from,
 * every cell exists, and the gap list is exactly the cells with nothing in it.
 */
describe('coverage matrix', () => {
  const matrix = getCoverageMatrix()

  it('covers every kind against every craft', () => {
    expect(matrix.rows).toHaveLength(KINDS.length)
    for (const row of matrix.rows) {
      expect(Object.keys(row.cells)).toHaveLength(CRAFTS.length)
      for (const craft of CRAFTS) {
        expect(row.cells[craft].kind).toBe(row.kind)
        expect(row.cells[craft].craft).toBe(craft)
      }
    }
  })

  it('counts match the catalog exactly', () => {
    for (const row of matrix.rows) {
      for (const craft of CRAFTS) {
        const expected = entries.filter(
          (entry) => entry.kind === row.kind && entry.craft === craft,
        ).length
        expect(row.cells[craft].count, `${row.kind} / ${craft}`).toBe(expected)
      }
    }
  })

  it('sums to the catalog size', () => {
    const total = matrix.rows.reduce(
      (sum, row) => sum + CRAFTS.reduce((inner, craft) => inner + row.cells[craft].count, 0),
      0,
    )
    expect(total).toBe(entries.length)
  })

  it('lists a gap only when the cell is empty', () => {
    const expected = matrix.rows.flatMap((row) =>
      CRAFTS.filter((craft) => row.cells[craft].count === 0).map((craft) => `${row.kind}/${craft}`),
    )
    expect(matrix.empty.map((cell) => `${cell.kind}/${cell.craft}`).sort()).toEqual(expected.sort())
  })

  it('calls a cell thin only when it holds one or two entries', () => {
    for (const cell of matrix.thin) {
      expect(cell.count).toBeGreaterThan(0)
      expect(cell.count).toBeLessThanOrEqual(2)
    }
  })

  it('names a fullest cell that is actually the busiest', () => {
    const busiest = matrix.rows
      .flatMap((row) => CRAFTS.map((craft) => row.cells[craft]))
      .reduce((best, cell) => (cell.count > best.count ? cell : best))
    expect(matrix.fullest.count).toBe(busiest.count)
  })

  it('shows at most the sample size of entries per cell', () => {
    for (const row of matrix.rows) {
      for (const craft of CRAFTS) {
        expect(row.cells[craft].sample.length).toBeLessThanOrEqual(2)
      }
    }
  })

  it('ranks emptiness as the least filled and the fullest as completely filled', () => {
    expect(cellFill(matrix.empty[0] ?? matrix.fullest, matrix.fullest.count)).toBe(0)
    expect(cellFill(matrix.fullest, matrix.fullest.count)).toBe(1)
  })

  it('survives an empty catalog without dividing by zero', () => {
    const fill = cellFill({ count: 0 } as never, 0)
    expect(fill).toBe(0)
  })
})
