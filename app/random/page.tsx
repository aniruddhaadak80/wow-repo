import type { Metadata } from 'next'
import { RandomRedirect } from '@/components/random-redirect'

export const metadata: Metadata = {
  title: 'Surprise me',
  description: 'Lands on a random entry from the registry.',
  robots: { index: false, follow: true },
}

export default function RandomPage() {
  return <RandomRedirect />
}
