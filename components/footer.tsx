import Link from 'next/link'
import { GithubLogo, ArrowUpRight } from '@phosphor-icons/react/ssr'
import { GITHUB_URL } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="container-x pt-16 pb-10">
        <p
          className="text-ink/5 font-sans text-[19vw] leading-[0.8] font-bold tracking-tighter select-none sm:text-[13rem]"
          aria-hidden="true"
        >
          wow<span className="text-accent/20">*</span>
        </p>

        <div className="border-line mt-10 grid gap-10 border-t pt-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-muted max-w-[42ch] text-sm leading-relaxed">
              A production-ready Next.js showcase of curated agent skills. Installable capabilities
              for coding, design, research, and content.
            </p>
            <p className="mono-label mt-4">{new Date().getFullYear()} wow-repo · MIT licensed</p>
          </div>

          <nav aria-label="Footer">
            <p className="mono-label mb-3">Navigate</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/skills" className="text-muted hover:text-ink transition-colors">
                  Explore skills
                </Link>
              </li>
              <li>
                <Link href="/discoveries" className="text-muted hover:text-ink transition-colors">
                  Frontier log
                </Link>
              </li>
              <li>
                <Link href="/#benchmarks" className="text-muted hover:text-ink transition-colors">
                  Benchmarks
                </Link>
              </li>
              <li>
                <Link href="/#how" className="text-muted hover:text-ink transition-colors">
                  How it works
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <p className="mono-label mb-3">Resources</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted hover:text-ink inline-flex items-center gap-1.5 transition-colors"
                >
                  <GithubLogo weight="regular" className="h-4 w-4" />
                  GitHub
                  <ArrowUpRight weight="regular" className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <Link
                  href="/api/skills"
                  className="text-muted hover:text-ink inline-flex items-center gap-1.5 transition-colors"
                >
                  Skills API
                  <ArrowUpRight weight="regular" className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/api/discoveries"
                  className="text-muted hover:text-ink inline-flex items-center gap-1.5 transition-colors"
                >
                  Frontier log API
                  <ArrowUpRight weight="regular" className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/api/benchmarks"
                  className="text-muted hover:text-ink inline-flex items-center gap-1.5 transition-colors"
                >
                  Benchmarks API
                  <ArrowUpRight weight="regular" className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-muted hover:text-ink inline-flex items-center gap-1.5 transition-colors"
                >
                  Sitemap
                  <ArrowUpRight weight="regular" className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mono-label mt-10">
          Built with Next.js 16, Tailwind CSS 4, and Motion. One accent. No purple gradients.
        </p>
      </div>
    </footer>
  )
}
