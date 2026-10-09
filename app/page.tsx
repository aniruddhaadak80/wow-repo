import { Hero } from '@/components/sections/hero'
import { LogoWall } from '@/components/logo-wall'
import { CatalogBento } from '@/components/sections/catalog-bento'
import { AppShowcase } from '@/components/sections/app-showcase'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Swarms } from '@/components/sections/swarms'
import { Benchmarks } from '@/components/sections/benchmarks'
import { CompanyBand } from '@/components/sections/company-band'
import { PreflightLedger } from '@/components/sections/preflight-ledger'
import { FrontierLog } from '@/components/sections/frontier-log'
import { ExplosionCurve } from '@/components/sections/explosion-curve'
import { Manifesto } from '@/components/sections/manifesto'
import { Faq } from '@/components/sections/faq'
import { Contribute } from '@/components/sections/contribute'
import { Cta } from '@/components/sections/cta'
import { SITE_URL } from '@/lib/constants'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'wow-repo',
  url: SITE_URL,
  description:
    'A production-ready Next.js showcase of curated agent skills: installable capabilities for coding, design, research, and content.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/skills?q={query}`,
    'query-input': 'required name=query',
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <LogoWall />
      <CatalogBento />
      <AppShowcase />
      <HowItWorks />
      <Swarms />
      <Benchmarks />
      <CompanyBand />
      <PreflightLedger />
      <FrontierLog />
      <ExplosionCurve />
      <Manifesto />
      <Faq />
      <Contribute />
      <Cta />
    </>
  )
}
