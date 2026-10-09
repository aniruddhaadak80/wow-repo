import { SkillsExplorer } from '@/components/skills-explorer'
import { getSkillEntries } from '@/lib/registry'

export const revalidate = 3600

export const metadata = {
  title: 'Explore skills',
  description:
    'Installable agent skills across design, developer experience, content, research, and multimedia.',
}

export default function SkillsPage() {
  const entries = getSkillEntries()

  return (
    <section className="container-x py-20 lg:py-24">
      <p className="eyebrow">The catalog</p>
      <h1 className="mt-5 max-w-[20ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        The catalog, in full.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        {entries.length} skills, one command each. Filter by craft, or search by the words you would
        actually use.
      </p>

      <SkillsExplorer />
    </section>
  )
}
