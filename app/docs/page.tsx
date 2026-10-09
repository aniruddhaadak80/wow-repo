import type { Metadata } from 'next'
import { Check } from '@phosphor-icons/react/ssr'
import { CopyButton } from '@/components/copy-button'
import { DOC_GROUPS, getDocPages, getDocSectionCount } from '@/lib/docs'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'How this repository is built: server-first architecture, the design system, motion, accessibility, the two deploy targets, and the quality gates.',
}

export default function DocsPage() {
  const pages = getDocPages()
  const sectionCount = getDocSectionCount()

  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">Docs</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        How this thing is built.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {pages.length} pages, {sectionCount} sections, every claim naming the file it comes from.
        Written for whoever has to change this next.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        {/* Contents */}
        <nav aria-label="Docs contents" className="lg:sticky lg:top-24 lg:self-start">
          {/* Mobile: horizontal pills */}
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {pages.map((doc) => (
              <li key={doc.slug}>
                <a
                  href={`#${doc.slug}`}
                  className="border-line text-muted hover:text-ink block shrink-0 rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition-colors"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop: grouped list */}
          <div className="hidden lg:block">
            {DOC_GROUPS.map((group) => (
              <div key={group} className="mb-6 last:mb-0">
                <p className="mono-label mb-2">{group}</p>
                <ul className="space-y-1.5">
                  {pages
                    .filter((doc) => doc.group === group)
                    .map((doc) => (
                      <li key={doc.slug}>
                        <a
                          href={`#${doc.slug}`}
                          className="text-muted hover:text-accent block text-sm transition-colors"
                        >
                          {doc.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Articles */}
        <div className="space-y-16">
          {pages.map((doc) => (
            <article key={doc.slug} id={doc.slug} className="scroll-mt-24">
              <header className="border-line border-b pb-5">
                <p className="mono-label">{doc.group}</p>
                <h2 className="text-ink mt-2 text-2xl font-bold tracking-tighter sm:text-3xl">
                  {doc.title}
                </h2>
                <p className="text-muted mt-3 max-w-[60ch] leading-relaxed">{doc.summary}</p>
              </header>

              <div className="mt-8 space-y-10">
                {doc.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="text-ink text-lg font-semibold tracking-tight">
                      {section.heading}
                    </h3>
                    <p className="text-muted mt-2 max-w-[68ch] leading-relaxed">{section.body}</p>

                    {section.code?.map((block) => (
                      <figure
                        key={block.label}
                        className="border-line bg-surface mt-5 overflow-hidden rounded-2xl border"
                      >
                        <div className="border-line flex items-center justify-between border-b px-4 py-2.5">
                          <figcaption className="mono-label">{block.label}</figcaption>
                          <CopyButton text={block.source} />
                        </div>
                        <pre className="overflow-x-auto p-4 font-mono text-xs leading-[1.9]">
                          <code className="text-ink">{block.source}</code>
                        </pre>
                      </figure>
                    ))}
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="border-line bg-elevated mt-16 flex items-start gap-3 rounded-2xl p-6">
        <Check weight="regular" className="text-accent mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p className="text-muted max-w-[68ch] text-sm leading-relaxed">
          Every code block on this page is the real file, copied at the time of writing. If a block
          and the file disagree, the file wins: the docs are checked into{' '}
          <code className="text-ink font-mono">content/docs.ts</code> like any other content.
        </p>
      </div>
    </section>
  )
}
