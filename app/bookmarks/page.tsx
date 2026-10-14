import type { Metadata } from 'next'
import Link from 'next/link'
import { BookmarksShelf } from '@/components/bookmarks-shelf'

export const metadata: Metadata = {
  title: 'Saved entries',
  description: 'The registry entries you saved in this browser. No account, no sync, all local.',
  robots: { index: false, follow: true },
}

export default function BookmarksPage() {
  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">Saved</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Your shelf.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        Entries save to this browser only, so the shelf is private by construction and needs no
        account. Clearing site data clears it.
      </p>

      <BookmarksShelf />
    </section>
  )
}
