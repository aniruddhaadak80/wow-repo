import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { GOOD_FIRST_ISSUES, ISSUE_LABELS } from './issues'

/*
 * Keeps the issue list honest. An issue that points at a file which has moved,
 * or asks someone to create a file that already exists, sends a contributor
 * looking for work that is not there.
 */
describe('good-first-issue list', () => {
  it('has a non-trivial first wave', () => {
    expect(GOOD_FIRST_ISSUES.length).toBeGreaterThanOrEqual(5)
  })

  it('uses unique ids and titles', () => {
    const ids = GOOD_FIRST_ISSUES.map((issue) => issue.id)
    const titles = GOOD_FIRST_ISSUES.map((issue) => issue.title)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('only uses declared labels', () => {
    for (const issue of GOOD_FIRST_ISSUES) {
      expect(ISSUE_LABELS).toContain(issue.label)
    }
  })

  it('gives every issue an honest effort estimate and a summary that says something', () => {
    for (const issue of GOOD_FIRST_ISSUES) {
      expect(issue.effort, issue.id).toMatch(/^~\d+ min$/)
      expect(issue.title.length, issue.id).toBeLessThanOrEqual(48)
      expect(issue.summary.length, issue.id).toBeGreaterThan(60)
      expect(issue.summary, issue.id).toMatch(/\.$/)
    }
  })

  it('points at one to three files per issue, with no repeats across the list', () => {
    const seen: string[] = []
    for (const issue of GOOD_FIRST_ISSUES) {
      expect(issue.files.length, issue.id).toBeGreaterThanOrEqual(1)
      expect(issue.files.length, issue.id).toBeLessThanOrEqual(3)
      for (const file of issue.files) {
        expect(file.path).not.toMatch(/^\.{1,2}\//)
        expect(seen).not.toContain(file.path)
        seen.push(file.path)
      }
    }
    expect(seen.length).toBeGreaterThanOrEqual(GOOD_FIRST_ISSUES.length)
  })

  it('only references files that exist, or marks the ones to create', () => {
    for (const issue of GOOD_FIRST_ISSUES) {
      for (const file of issue.files) {
        const resolved = path.resolve(process.cwd(), file.path)
        if (file.creates) {
          expect(existsSync(resolved), `${file.path} should not exist yet`).toBe(false)
        } else {
          expect(existsSync(resolved), `${file.path} should exist`).toBe(true)
        }
      }
    }
  })
})
