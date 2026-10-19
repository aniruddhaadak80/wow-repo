import Link from 'next/link'
import { cellFill, getCoverageMatrix } from '@/lib/coverage'
import { CRAFTS, KIND_META, KINDS } from '@/content/registry'

export const revalidate = 3600

export const metadata = {
  title: 'Coverage',
  description:
    'Every kind against every craft: which corners of the catalog are full, which are thin, and which are empty.',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Registry coverage matrix',
}

export default function MatrixPage() {
  const matrix = getCoverageMatrix()
  const total = matrix.rows.reduce((sum, row) => sum + row.total, 0)

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <p className="eyebrow">Coverage</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Where the catalog is thin.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {total} entries across {KINDS.length} kinds and {CRAFTS.length} crafts. A full cell means
        that corner is covered. An empty one is a gap, and a cell with one or two entries is a
        single contribution away from being solid.
      </p>

      <div className="border-line bg-elevated text-muted mt-6 inline-flex flex-wrap gap-x-5 gap-y-1 rounded-lg border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase">
        <span>{matrix.empty.length} empty</span>
        <span>{matrix.thin.length} thin</span>
        <span>
          fullest {matrix.fullest.kindLabel} / {matrix.fullest.craft}
        </span>
      </div>

      <div className="mt-12 overflow-x-auto pb-2">
        <div
          className="grid min-w-[640px] gap-2"
          style={{ gridTemplateColumns: `minmax(140px, 1.2fr) repeat(${CRAFTS.length}, 1fr)` }}
          role="table"
          aria-label="Entry counts by kind and craft"
        >
          <div className="text-muted flex items-end px-2 pb-1 font-mono text-[10px] tracking-[0.14em] uppercase">
            Kind \ Craft
          </div>
          {CRAFTS.map((craft) => (
            <div
              key={craft}
              className="text-muted px-2 pb-1 text-center font-mono text-[10px] tracking-[0.14em] uppercase"
            >
              {craft}
            </div>
          ))}

          {matrix.rows.map((row) => (
            <MatrixRow key={row.kind} row={row} fullest={matrix.fullest.count} />
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="border-line mb-4 flex items-baseline justify-between gap-3 border-b pb-3">
            <h2 className="text-ink text-2xl font-semibold tracking-tight">Empty cells</h2>
            <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
              {matrix.empty.length} gaps
            </span>
          </div>
          {matrix.empty.length === 0 ? (
            <p className="text-muted text-sm">
              Nothing. Every kind and craft combination has at least one entry.
            </p>
          ) : (
            <ul className="space-y-2">
              {matrix.empty.map((cell) => (
                <li
                  key={`${cell.kind}-${cell.craft}`}
                  className="border-line bg-surface flex items-center justify-between rounded-xl border px-4 py-2.5"
                >
                  <span className="text-ink text-sm font-medium">
                    {cell.kindLabel} for {cell.craft}
                  </span>
                  <span className="text-muted font-mono text-xs">0 entries</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="border-line mb-4 flex items-baseline justify-between gap-3 border-b pb-3">
            <h2 className="text-ink text-2xl font-semibold tracking-tight">
              One contribution away
            </h2>
            <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
              {matrix.thin.length} cells
            </span>
          </div>
          {matrix.thin.length === 0 ? (
            <p className="text-muted text-sm">
              Nothing this thin. Every populated cell holds at least three entries.
            </p>
          ) : (
            <ul className="space-y-2">
              {matrix.thin.map((cell) => (
                <li
                  key={`${cell.kind}-${cell.craft}`}
                  className="border-line bg-surface flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5"
                >
                  <span className="text-ink text-sm font-medium">
                    {cell.kindLabel} for {cell.craft}
                  </span>
                  <span className="text-muted shrink-0 font-mono text-xs">
                    {cell.count} {cell.count === 1 ? 'entry' : 'entries'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-muted mt-12 text-sm">
        Want a different axis? Browse by{' '}
        <Link href="/kinds" className="text-ink underline underline-offset-4">
          kind
        </Link>{' '}
        or{' '}
        <Link href="/crafts" className="text-ink underline underline-offset-4">
          craft
        </Link>
        , or open the full{' '}
        <Link href="/skills" className="text-ink underline underline-offset-4">
          registry
        </Link>
        .
      </p>
    </section>
  )
}

function MatrixRow({
  row,
  fullest,
}: {
  row: ReturnType<typeof getCoverageMatrix>['rows'][number]
  fullest: number
}) {
  return (
    <>
      <div className="border-line bg-elevated flex flex-col justify-center rounded-xl border px-2 py-2">
        <span className="text-ink text-xs font-semibold">{row.kindLabel}</span>
        <span className="text-muted font-mono text-[10px] tabular-nums">{row.total}</span>
      </div>
      {CRAFTS.map((craft) => {
        const cell = row.cells[craft]
        const fill = cellFill(cell, fullest)
        return (
          <Link
            key={craft}
            href={`/skills?kind=${row.kind}&craft=${craft}`}
            className="border-line bg-surface group hover:border-ink/25 flex flex-col justify-between rounded-xl border px-2 py-2 transition-colors"
          >
            <span className="text-ink text-center font-mono text-sm font-semibold tabular-nums">
              {cell.count}
            </span>
            <span className="bg-elevated mt-1.5 block h-1 w-full overflow-hidden rounded-full">
              <span
                className="bg-accent block h-full"
                style={{ width: `${Math.round(fill * 100)}%` }}
                aria-hidden="true"
              />
            </span>
          </Link>
        )
      })}
    </>
  )
}
