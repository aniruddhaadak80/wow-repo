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
import { WorldAfter } from '@/components/sections/world-after'
import { Manifesto } from '@/components/sections/manifesto'
import { Faq } from '@/components/sections/faq'
import { Contribute } from '@/components/sections/contribute'
import { Cta } from '@/components/sections/cta'
import { SITE_URL } from '@/lib/constants'
import { getEntries } from '@/lib/registry'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'wow-repo',
  url: SITE_URL,
  description:
    'A production-ready Next.js showcase of the open agent stack: skills, MCP servers, public APIs, protocols, harnesses, and free software.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/skills?q={query}`,
    'query-input': 'required name=query',
  },
}

/*
 * The featured entries, as structured data. Google renders an ItemList carousel
 * for this shape, which is the honest way to advertise the catalog: the items
 * are real registry entries with real source URLs, not invented links.
 */
const itemListLd = (() => {
  const featured = getEntries()
    .filter((entry) => entry.featured)
    .slice(0, 8)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured registry entries',
    numberOfItems: featured.length,
    itemListElement: featured.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      description: entry.tagline,
      url: `${SITE_URL}/skills/${entry.slug}`,
    })),
  }
})()

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Registry', item: `${SITE_URL}/skills` },
    { '@type': 'ListItem', position: 3, name: 'Compare', item: `${SITE_URL}/compare` },
    { '@type': 'ListItem', position: 4, name: 'Docs', item: `${SITE_URL}/docs` },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
      <WorldAfter />
      <Manifesto />
      <Faq />
      <Contribute />
      <Cta />
    </>
  )
}
