import Link from 'next/link'
import { ArrowUpRight, GithubLogo, Rocket } from '@phosphor-icons/react/ssr'
import { GITHUB_URL } from '@/lib/constants'

/** A real Vercel deep link: clones this repo and starts a deployment. */
const DEPLOY_URL = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(GITHUB_URL)}&project-name=wow-repo&repository-name=wow-repo`

export function Cta() {
  return (
    <section className="container-x py-28 text-center lg:py-36">
      <h2 className="mx-auto max-w-[16ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Ready when you are.
      </h2>
      <p className="text-muted mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed">
        Fork the repo, deploy it, and swap the demo data for your own. The build is green, the
        catalog is open, and the source is public.
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
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="border-line text-ink hover:border-ink/30 flex h-12 items-center gap-2 rounded-full border px-7 text-sm font-medium transition-colors duration-200"
        >
          <GithubLogo weight="regular" className="h-4 w-4" />
          GitHub
          <ArrowUpRight weight="regular" className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mono-label mt-6">
        Deploys as a static site. No environment variables required.
      </p>
    </section>
  )
}
