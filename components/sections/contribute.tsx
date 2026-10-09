import { ArrowUpRight } from '@phosphor-icons/react/ssr'
import { GOOD_FIRST_ISSUES } from '@/content/issues'
import { CopyButton } from '@/components/copy-button'
import { ISSUES_URL } from '@/lib/constants'

/** Copyable claim command. Works anywhere the GitHub CLI is installed. */
const CLAIM_COMMAND = 'gh issue list --label "good first issue" --limit 5'

/**
 * The contributor door. Server Component: the only interactive part is the
 * existing CopyButton client leaf. Layout is a copy column plus a stack of
 * issue cards, which is a different family from the bento and the numbered
 * steps above it.
 */
export function Contribute() {
  return (
    <section
      id="contribute"
      className="container-x border-line scroll-mt-24 border-t py-24 lg:py-32"
    >
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <span className="border-line bg-surface text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.16em] uppercase">
            <span className="bg-accent h-1.5 w-1.5 rounded-full" aria-hidden />
            Hacktoberfest 2026
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tighter sm:text-5xl">
            Five issues, one path in.
          </h2>

          <p className="text-muted mt-5 max-w-[44ch] text-lg leading-relaxed">
            Every issue names the files it touches and what “done” looks like, so you can start
            without asking what to do.
          </p>

          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-accent text-on-accent mt-8 flex h-12 w-fit items-center gap-2 rounded-full px-7 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            Browse open issues
            <ArrowUpRight weight="regular" className="h-4 w-4" />
          </a>

          <div className="border-line bg-surface mt-6 flex items-center justify-between gap-3 rounded-lg border px-4 py-3">
            <code className="text-ink truncate font-mono text-xs">{CLAIM_COMMAND}</code>
            <CopyButton text={CLAIM_COMMAND} />
          </div>

          <p className="mono-label mt-3">
            Or start from the guide: <code className="text-accent">CONTRIBUTING.md</code>
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {GOOD_FIRST_ISSUES.map((issue, index) => (
            <li key={issue.id}>
              <a
                href={ISSUES_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="group border-line bg-surface hover:border-ink/25 flex h-full flex-col gap-3 rounded-2xl border p-5 transition-colors duration-300"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="text-muted font-mono text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="border-line text-muted rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase">
                      {issue.label}
                    </span>
                    <span className="mono-label whitespace-nowrap">{issue.effort}</span>
                    <ArrowUpRight
                      weight="regular"
                      className="text-accent h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </span>
                </span>

                <span className="text-ink text-lg font-medium tracking-tight">{issue.title}</span>
                <span className="text-muted max-w-[62ch] text-sm leading-relaxed">
                  {issue.summary}
                </span>

                <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2">
                  {issue.files.map((file) => (
                    <code key={file.path} className="mono-label text-accent">
                      {file.creates ? `+ ${file.path}` : file.path}
                    </code>
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
