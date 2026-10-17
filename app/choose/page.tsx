import { StackChooser } from '@/components/stack-chooser'
import { KIND_META } from '@/content/registry'
import { getChooserCatalog, getChooserOptions } from '@/lib/chooser-catalog'

export const revalidate = 3600

export const metadata = {
  title: 'Choose a stack',
  description:
    'Answer three questions and get a shortlist from the registry, with the reason each entry surfaced.',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Stack chooser',
  applicationCategory: 'DeveloperApplication',
  description: 'A shortlist from the registry with the reason each entry surfaced.',
}

export default function ChoosePage() {
  const catalog = getChooserCatalog()
  const { crafts, kinds } = getChooserOptions()
  const kindOptions = kinds.map((kind) => ({ value: kind, label: KIND_META[kind].label }))

  return (
    <section className="container-x py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <p className="eyebrow">Choose</p>
      <h1 className="mt-5 max-w-[22ch] text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
        Pick a goal, get a shortlist.
      </h1>
      <p className="text-muted mt-5 max-w-[65ch] text-lg leading-relaxed">
        Three questions over {catalog.length} entries. The chooser scores each one and shows its
        work, so you can disagree with a pick and still see why it came up.
      </p>

      <StackChooser catalog={catalog} crafts={crafts} kindOptions={kindOptions} />
    </section>
  )
}
