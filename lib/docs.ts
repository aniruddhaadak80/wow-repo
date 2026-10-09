import { docs, DOC_GROUPS, type DocPage } from '@/content/docs'

export type { DocPage, DocSection, DocCodeBlock } from '@/content/docs'
export { DOC_GROUPS } from '@/content/docs'

export function getDocPages(): DocPage[] {
  return docs
}

export function getDocBySlug(slug: string): DocPage | undefined {
  return docs.find((doc) => doc.slug === slug)
}

export function getDocSlugs(): string[] {
  return docs.map((doc) => doc.slug)
}

export function getDocsByGroup(group: (typeof DOC_GROUPS)[number]): DocPage[] {
  return docs.filter((doc) => doc.group === group)
}

/** Total number of documented sections, for the docs index header. */
export function getDocSectionCount(): number {
  return docs.reduce((sum, doc) => sum + doc.sections.length, 0)
}
