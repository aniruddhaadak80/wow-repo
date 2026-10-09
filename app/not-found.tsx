import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/ssr'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-accent font-mono text-7xl font-bold tracking-tighter sm:text-8xl">404</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tighter sm:text-4xl">
        This page never got a skill.
      </h1>
      <p className="text-muted mt-4 max-w-[44ch] text-lg leading-relaxed">
        The route you asked for isn’t in the catalog. The home page is one click away.
      </p>
      <Link
        href="/"
        className="bg-accent text-on-accent mt-9 flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
      >
        Back home
        <ArrowRight weight="regular" className="h-4 w-4" />
      </Link>
    </section>
  )
}
