import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/ssr'
import type { RegistryEntry } from '@/content/registry'
import { formatEntryDate } from '@/lib/registry'

export function SkillCard({ entry }: { entry: RegistryEntry }) {
  return (
    <Link
      href={`/skills/${entry.slug}`}
      className="group border-line bg-surface hover:border-ink/25 flex h-full flex-col rounded-2xl border p-5 transition-colors duration-300"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="bg-elevated text-accent flex h-10 w-10 items-center justify-center rounded-2xl font-mono text-base font-semibold">
          {entry.name.charAt(0)}
        </span>
        <ArrowUpRight
          weight="regular"
          className="text-accent h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <h3 className="text-ink font-medium tracking-tight">{entry.name}</h3>
      <p className="text-muted mt-1 text-sm leading-relaxed">{entry.tagline}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="border-line text-muted rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase">
          {entry.craft}
        </span>
        <span className="mono-label shrink-0">{formatEntryDate(entry.addedAt)}</span>
      </div>
    </Link>
  )
}
