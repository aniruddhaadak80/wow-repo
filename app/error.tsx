'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Something broke</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tighter sm:text-4xl">
        The page tripped over itself.
      </h1>
      <p className="text-muted mt-4 max-w-[48ch] text-lg leading-relaxed">
        An error surfaced while rendering. Try again, or head back to the catalog.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-accent text-on-accent flex h-12 items-center rounded-full px-7 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
        >
          Try again
        </button>
        <Link
          href="/skills"
          className="border-line text-ink hover:border-ink/30 flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors"
        >
          Back to skills
        </Link>
      </div>
      {error.digest && <p className="mono-label mt-8">digest: {error.digest}</p>}
    </section>
  )
}
