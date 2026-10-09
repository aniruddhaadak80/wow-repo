import Link from 'next/link'
import { ArrowUpRight, Rocket } from '@phosphor-icons/react/ssr'
import { GITHUB_URL } from '@/lib/constants'

/** A real Vercel deep link: clones this repo and starts a deployment. */
const DEPLOY_URL = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(
  GITHUB_URL,
)}&project-name=wow-repo&repository-name=wow-repo`

export function AgentsCta() {
  return (
    <section className="container-x border-line border-t py-28 text-center lg:py-36">
      <h2 className="mx-auto max-w-[18ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Swap the roster for your own.
      </h2>
      <p className="text-muted mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed">
        Every number on this page comes from one file. Replace the demo org with your runbooks and
        the map rebuilds itself.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href={DEPLOY_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="bg-accent text-on-accent flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
        >
          Deploy to Vercel
          <Rocket weight="regular" className="h-4 w-4" />
        </a>
        <Link
          href="/skills"
          className="border-line text-ink hover:border-ink/30 flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors duration-200"
        >
          Browse the registry
          <ArrowUpRight weight="regular" className="ml-1.5 h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="mono-label mt-6">content/company.ts is the whole data layer.</p>
    </section>
  )
}
