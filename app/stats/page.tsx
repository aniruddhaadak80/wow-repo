import type { Metadata } from 'next'
import {
  getAddedTimeline,
  getCraftKindMatrix,
  getCraftStats,
  getKindStats,
  getLicenseStats,
  getNewestEntries,
  getRegistrySummary,
  getTopTriggers,
} from '@/lib/stats'
import { formatEntryDate } from '@/lib/registry'
import { KIND_META, KINDS } from '@/content/registry'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Registry stats',
  description:
    'What the catalog actually contains: entries per kind and craft, additions per month, licence mix, and the busiest month. Computed from the registry, not typed by hand.',
}

function Bar({
  label,
  count,
  share,
  max,
  suffix,
}: {
  label: string
  count: number
  share: number
  max: number
  suffix?: string
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1">
      <span className="text-ink truncate text-sm font-medium">{label}</span>
      <span className="text-muted font-mono text-xs tabular-nums">
        {count}
        {suffix ? ` ${suffix}` : ''}
      </span>
      <div className="bg-elevated col-span-2 h-2 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full"
          style={{ width: `${max === 0 ? 0 : Math.round((count / max) * 100)}%` }}
        />
      </div>
      <span className="text-muted col-span-2 font-mono text-[10px]">
        {(share * 100).toFixed(share >= 0.1 ? 0 : 1)}% of the catalog
      </span>
    </div>
  )
}

export default function StatsPage() {
  const summary = getRegistrySummary()
  const kindStats = getKindStats()
  const craftStats = getCraftStats()
  const timeline = getAddedTimeline()
  const licenses = getLicenseStats()
  const matrix = getCraftKindMatrix()
  const newest = getNewestEntries(6)
  const triggers = getTopTriggers(8)

  const maxKind = Math.max(...kindStats.map((row) => row.count), 1)
  const maxCraft = Math.max(...craftStats.map((row) => row.count), 1)
  const maxMonth = Math.max(...timeline.map((bucket) => bucket.count), 1)

  const headline = [
    { label: 'Entries', value: summary.total },
    { label: 'Kinds', value: summary.kinds },
    { label: 'Crafts', value: summary.crafts },
    { label: 'Skills', value: summary.skills },
    { label: 'Featured', value: summary.featured },
  ]

  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">Stats</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        The catalog, measured.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        Every number on this page is computed from the registry at build time. Nothing is typed by
        hand, so nothing can drift out of date.
      </p>

      <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {headline.map((item) => (
          <div key={item.label} className="border-line bg-surface rounded-2xl border p-5">
            <dt className="mono-label">{item.label}</dt>
            <dd className="text-ink mt-2 font-mono text-3xl font-bold tracking-tighter tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">By kind</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Six kinds make up the stack. Skills lead, because this is a skills showcase.
          </p>
          <div className="mt-6 space-y-5">
            {kindStats.map((row) => (
              <Bar
                key={row.key}
                label={KIND_META[row.key as keyof typeof KIND_META].label}
                count={row.count}
                share={row.share}
                max={maxKind}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tighter">By craft</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Five crafts, so a skill lands next to the work it belongs to.
          </p>
          <div className="mt-6 space-y-5">
            {craftStats.map((row) => (
              <Bar
                key={row.key}
                label={row.label}
                count={row.count}
                share={row.share}
                max={maxCraft}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-line mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold tracking-tighter">Additions per month</h2>
        <p className="text-muted mt-2 max-w-[65ch] text-sm leading-relaxed">
          {summary.months} months of sample catalog dates. The quiet months are shown, because
          skipping them would make the growth look smoother than it was.
        </p>

        <div className="mt-8 flex items-end gap-1.5 sm:gap-2.5" aria-hidden="true">
          {timeline.map((bucket) => (
            <div key={bucket.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="bg-elevated flex h-32 w-full items-end rounded-t-lg">
                <div
                  className="bg-accent w-full rounded-t-lg"
                  style={{
                    height: `${Math.max(2, Math.round((bucket.count / maxMonth) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-muted truncate font-mono text-[9px] sm:text-[10px]">
                {bucket.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
        <table className="sr-only">
          <caption>Entries added per month across the catalog</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Entries added</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((bucket) => (
              <tr key={bucket.month}>
                <th scope="row">{bucket.label}</th>
                <td>{bucket.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {summary.busiestMonth && (
          <p className="mono-label mt-6">
            Busiest month: {summary.busiestMonth.label} with {summary.busiestMonth.count} entries
          </p>
        )}
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Craft by kind</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Where each craft spends its entries.
          </p>
          <div className="border-line mt-6 overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-line border-b">
                  <th scope="col" className="mono-label px-4 py-3 font-normal">
                    Craft
                  </th>
                  {KINDS.map((kind) => (
                    <th
                      key={kind}
                      scope="col"
                      className="mono-label px-3 py-3 text-center font-normal"
                    >
                      {KIND_META[kind].label}
                    </th>
                  ))}
                  <th scope="col" className="mono-label px-3 py-3 text-right font-normal">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.craft} className="border-line border-b last:border-0">
                    <th scope="row" className="text-ink px-4 py-3 font-medium">
                      {row.label}
                    </th>
                    {KINDS.map((kind) => (
                      <td
                        key={kind}
                        className="px-3 py-3 text-center font-mono text-xs tabular-nums"
                      >
                        {row.counts[kind] > 0 ? (
                          <span className="text-ink">{row.counts[kind]}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    ))}
                    <td className="text-ink px-3 py-3 text-right font-mono text-xs font-semibold tabular-nums">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Licences</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            {summary.licensed} of {summary.total} entries state a licence. The rest link out to the
            source for the answer.
          </p>
          <div className="mt-6 space-y-4">
            {licenses.map((row) => (
              <Bar
                key={row.license}
                label={row.license}
                count={row.count}
                share={row.share}
                max={licenses[0].count}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Newest entries</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            The tail of the catalog, by sample catalog date.
          </p>
          <ul className="divide-line mt-6 divide-y">
            {newest.map((entry) => (
              <li key={entry.slug} className="flex items-center justify-between gap-4 py-3">
                <Link
                  href={`/skills/${entry.slug}`}
                  className="text-ink hover:text-accent min-w-0 truncate text-sm font-medium transition-colors"
                >
                  {entry.name}
                </Link>
                <span className="mono-label shrink-0">{formatEntryDate(entry.addedAt)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Most useful triggers</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            The search terms that surface the most entries. What people would actually type.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {triggers.map((trigger) => (
              <li
                key={trigger.trigger}
                className="border-line bg-surface text-muted inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-xs"
              >
                {trigger.trigger}
                <span className="text-accent tabular-nums">{trigger.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-muted border-line mt-16 border-t pt-6 text-xs leading-relaxed">
        Dates, and everything derived from them, are sample catalog data for this demo. Counts,
        shares, and the licence mix are computed from the same file the rest of the site reads.
      </p>
    </section>
  )
}
