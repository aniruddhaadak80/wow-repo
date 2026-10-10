import { CatalogSearch } from '@/components/catalog-search'
import { getEntries } from '@/lib/registry'

export function Hero() {
  const entries = getEntries()

  return (
    <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
      <div className="min-w-0">
        <h1 className="text-5xl leading-[1.04] font-bold tracking-tighter sm:text-6xl lg:text-7xl">
          Skills that ship. Sites that <em className="text-accent italic">wow</em>.
        </h1>
        <p className="text-muted mt-6 max-w-[58ch] text-lg leading-relaxed">
          The open agent stack in one place: skills, MCP servers, public APIs, protocols, harnesses,
          and free software.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#how"
            className="border-line text-ink hover:border-ink/30 flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors duration-200"
          >
            How it works
          </a>
        </div>
      </div>

      <div className="min-w-0 lg:pl-4">
        <CatalogSearch entries={entries} />
      </div>
    </section>
  )
}
