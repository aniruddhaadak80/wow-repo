import type { Metadata } from 'next'
import { AgentsHero } from '@/components/sections/agents-hero'
import { OrgMap } from '@/components/sections/org-map'
import { Guardrails, RunReplay } from '@/components/sections/run-replay'
import { AgentsCta } from '@/components/sections/agents-cta'
import { SITE_URL } from '@/lib/constants'
import { automatedRunbooks, departments, totalAgents, totalRunbooks } from '@/content/company'

export const metadata: Metadata = {
  title: 'Company automation map',
  description:
    'A demo org of twenty-four agents across eight departments. Each one runs a real runbook, records what it did, and stops at the human gate.',
  alternates: { canonical: '/agents' },
}

export const revalidate = 3600

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Company automation map',
  url: `${SITE_URL}/agents`,
  description:
    'A demo org of twenty-four agents across eight departments, with a replayable orchestration run.',
  about: departments.map((dept) => ({
    '@type': 'Organization',
    name: dept.name,
    description: dept.summary,
  })),
}

export default function AgentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentsHero />
      <OrgMap />
      <RunReplay />
      <Guardrails />
      <AgentsCta />
    </>
  )
}
