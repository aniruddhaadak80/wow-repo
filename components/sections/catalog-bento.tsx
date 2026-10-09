import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react/ssr'
import { CopyButton } from '@/components/copy-button'
import { formatEntryDate, getEntryBySlug, getSkillEntries } from '@/lib/registry'
import { SkillCard } from '@/components/skill-card'

const FEATURED_SLUG = 'design-taste-frontend'
const MINI_CARD_SLUG = 'vercel-edge-optimizer'

export function CatalogBento() {
  const featured = getEntryBySlug(FEATURED_SLUG)
  const miniCard = getEntryBySlug(MINI_CARD_SLUG)
  const total = getSkillEntries().length

  if (!featured || !miniCard) return null

  return (
    <section id="catalog" className="container-x scroll-mt-24 py-24 lg:py-32">
      <h2 className="max-w-[18ch] text-4xl font-bold tracking-tighter sm:text-5xl">
        Every skill, one catalog.
      </h2>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {total} installable skills across five crafts. Each one ships as a markdown file you can
        read before you run it.
      </p>

      {/* 6 columns. Row 1: 4 + 2. Row 2: 4 + 2. Row 3: 3 + 3. No empty cells. */}
      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-6">
        {/* Featured skill */}
        <article className="border-line bg-elevated flex flex-col rounded-2xl border p-7 lg:col-span-4 lg:row-span-2 lg:p-9">
          <div className="flex items-center justify-between gap-4">
            <span className="bg-accent text-on-accent flex h-14 w-14 items-center justify-center rounded-2xl font-mono text-xl font-bold">
              {featured.name.charAt(0)}
            </span>
            <span className="border-line bg-surface text-muted rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
              {featured.craft}
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight lg:text-3xl">
            {featured.name}
          </h3>
          <p className="text-muted mt-3 max-w-[56ch] text-base leading-relaxed lg:text-lg">
            {featured.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {featured.triggers.slice(0, 4).map((trigger) => (
              <span
                key={trigger}
                className="border-line bg-surface text-muted rounded-full border px-3 py-1 font-mono text-xs"
              >
                {trigger}
              </span>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
            <span className="mono-label">Updated {formatEntryDate(featured.addedAt)}</span>
            <Link
              href={`/skills/${featured.slug}`}
              className="text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-[filter] hover:brightness-110"
            >
              Read the skill
              <ArrowRight weight="regular" className="h-4 w-4" />
            </Link>
          </div>
        </article>

        {/* The real file format, with a working copy button */}
        <article className="border-line bg-surface flex flex-col rounded-2xl border p-6 lg:col-span-2 lg:row-span-2">
          <div className="flex items-center justify-between gap-3">
            <span className="mono-label">skill.md</span>
            <CopyButton text={frontmatter(featured.name, featured.craft, featured.triggers)} />
          </div>
          <pre className="mt-5 flex-1 overflow-x-auto font-mono text-xs leading-[1.9]">
            <code>
              <span className="text-muted">{'---\n'}</span>
              <span className="text-muted">name</span>
              <span className="text-ink">: </span>
              <span className="text-accent">{featured.name}</span>
              {'\n'}
              <span className="text-muted">craft</span>
              <span className="text-ink">: </span>
              <span className="text-accent">{featured.craft}</span>
              {'\n'}
              <span className="text-muted">triggers</span>
              <span className="text-ink">:</span>
              {'\n'}
              {featured.triggers.slice(0, 4).map((trigger) => (
                <span key={trigger}>
                  <span className="text-muted">{'  - '}</span>
                  <span className="text-accent">{trigger}</span>
                  {'\n'}
                </span>
              ))}
              <span className="text-muted">{'---'}</span>
            </code>
          </pre>
        </article>

        {/* Catalog counts, live from the content module */}
        <article className="border-line bg-accent-soft flex flex-col justify-between rounded-2xl border p-6 lg:col-span-2">
          <div>
            <p className="text-ink font-mono text-5xl tracking-tighter">{total}</p>
            <p className="text-ink/70 mt-2 text-sm">skills curated</p>
          </div>
          <dl className="border-line mt-6 space-y-3 border-t pt-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink/70">crafts</dt>
              <dd className="text-ink font-mono">5</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink/70">routes built at compile time</dt>
              <dd className="text-ink font-mono">{total + 2}</dd>
            </div>
          </dl>
        </article>

        {/* Real photography */}
        <figure className="border-line relative min-h-[280px] overflow-hidden rounded-2xl border lg:col-span-2">
          <Image
            src="https://picsum.photos/seed/warmup-workbench/1200/800?grayscale"
            alt="A workbench with a laptop, a notebook, and a cup of coffee"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </figure>

        {/* Mini skill card */}
        <div className="lg:col-span-2">
          <SkillCard entry={miniCard} />
        </div>
      </div>
    </section>
  )
}

function frontmatter(name: string, craft: string, triggers: readonly string[]): string {
  return [
    '---',
    `name: ${name}`,
    `craft: ${craft}`,
    'triggers:',
    ...triggers.slice(0, 4).map((t) => `  - ${t}`),
    '---',
  ].join('\n')
}
