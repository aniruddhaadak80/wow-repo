import Link from 'next/link'
import { getChangelogStats, getReleases, type ChangelogTag } from '@/content/changelog'

export const revalidate = 3600

export const metadata = {
  title: 'Changelog',
  description: 'How the open agent showcase got here: every release, newest first.',
}

const TAG_STYLE: Record<ChangelogTag, string> = {
  feature: 'border-accent text-accent',
  fix: 'border-line text-muted',
  docs: 'border-line text-muted',
  quality: 'border-line text-muted',
  ci: 'border-line text-muted',
}

const TAG_LABEL: Record<ChangelogTag, string> = {
  feature: 'Feature',
  fix: 'Fix',
  docs: 'Docs',
  quality: 'Quality',
  ci: 'CI',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Changelog',
}

export default function ChangelogPage() {
  const releases = getReleases()
  const stats = getChangelogStats()

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <p className="eyebrow">Changelog</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        How it got here.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {stats.releases} {stats.releases === 1 ? 'release' : 'releases'}, latest {stats.latest} on{' '}
        {stats.date}, across {stats.entries} changes. Every line maps to real commits in the{' '}
        <Link
          href="https://github.com/aniruddhaadak80/wow-repo"
          className="text-ink underline underline-offset-4"
        >
          repository
        </Link>
        .
      </p>

      <ol className="mt-14 space-y-12">
        {releases.map((release) => (
          <li
            key={release.version}
            className="border-line border-t pt-8 first:border-t-0 first:pt-0"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="bg-elevated text-accent rounded-full px-3 py-1 font-mono text-sm font-semibold">
                v{release.version}
              </span>
              <time dateTime={release.date} className="text-muted font-mono text-sm tabular-nums">
                {release.date}
              </time>
            </div>

            <h2 className="text-ink mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              {release.title}
            </h2>
            <p className="text-muted mt-2 max-w-[65ch] leading-relaxed">{release.summary}</p>

            <ul className="mt-5 space-y-2">
              {release.entries.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase ${TAG_STYLE[entry.tag]}`}
                  >
                    {TAG_LABEL[entry.tag]}
                  </span>
                  <span className="text-ink leading-relaxed">{entry.text}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="text-muted mt-12 text-sm">
        Curious what each surface actually does? Take the{' '}
        <Link href="/docs" className="text-ink underline underline-offset-4">
          tour
        </Link>
        .
      </p>
    </section>
  )
}
