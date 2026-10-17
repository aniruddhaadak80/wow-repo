import { describe, expect, it } from 'vitest'
import { CHANGELOG, getChangelogStats, getReleases } from './changelog'

/*
 * The changelog is user-visible prose pulled from the commit history, so the
 * tests guard the things a reader would notice: a sane date, no duplicate
 * version, newest first, and no em-dashes (the repo rule).
 */
const EM_DASH = '—'

function prose(): string[] {
  return CHANGELOG.flatMap((release) => [
    release.title,
    release.summary,
    ...release.entries.map((entry) => entry.text),
  ])
}

describe('changelog', () => {
  it('has a version, a date, and at least one entry per release', () => {
    for (const release of CHANGELOG) {
      expect(release.version).toMatch(/^\d+\.\d+\.\d+$/)
      expect(release.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(release.title.length).toBeGreaterThan(0)
      expect(release.summary.length).toBeGreaterThan(0)
      expect(release.entries.length).toBeGreaterThan(0)
    }
  })

  it('never repeats a version', () => {
    const versions = CHANGELOG.map((release) => release.version)
    expect(new Set(versions).size).toBe(versions.length)
  })

  it('never repeats a change id inside a release', () => {
    for (const release of CHANGELOG) {
      const ids = release.entries.map((entry) => entry.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('serves releases newest first', () => {
    const dates = getReleases().map((release) => release.date)
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)))
  })

  it('only uses real tags', () => {
    const tags = new Set(['feature', 'fix', 'docs', 'quality', 'ci'])
    for (const release of CHANGELOG) {
      for (const entry of release.entries) {
        expect(tags.has(entry.tag)).toBe(true)
      }
    }
  })

  it('keeps em-dashes out of user-visible strings', () => {
    for (const line of prose()) {
      expect(line).not.toContain(EM_DASH)
    }
  })

  it('summarises itself correctly', () => {
    const stats = getChangelogStats()
    expect(stats.releases).toBe(CHANGELOG.length)
    expect(stats.latest).toBe(getReleases()[0]?.version)
    expect(stats.date).toBe(getReleases()[0]?.date)
    expect(stats.entries).toBe(
      CHANGELOG.reduce((total, release) => total + release.entries.length, 0),
    )
  })
})
