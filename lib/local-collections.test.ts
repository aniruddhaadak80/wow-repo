import { beforeEach, describe, expect, it } from 'vitest'
import {
  getServerList,
  pushLocalList,
  readLocalList,
  subscribeLocalList,
  toggleLocalList,
  writeLocalList,
} from './local-collections'

/*
 * The store behind bookmarks and recently-viewed. These run in the jsdom
 * environment, so localStorage exists. The contract that matters: reads are
 * pure (so useSyncExternalStore is happy), writes notify subscribers, and a
 * corrupted value degrades to empty instead of throwing.
 */
describe('local collections', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('reads back what it wrote', () => {
    writeLocalList('k', ['a', 'b'])
    expect(readLocalList('k')).toEqual(['a', 'b'])
  })

  it('notifies subscribers on write so mounted views re-read', () => {
    let calls = 0
    const unsubscribe = subscribeLocalList(() => {
      calls += 1
    })
    writeLocalList('k', ['a'])
    writeLocalList('k', ['a', 'b'])
    expect(calls).toBe(2)
    unsubscribe()
    writeLocalList('k', ['a'])
    expect(calls).toBe(2)
  })

  it('pushes to the front, de-duplicates, and caps the list', () => {
    pushLocalList('k', 'first')
    pushLocalList('k', 'second')
    pushLocalList('k', 'first')
    expect(readLocalList('k')).toEqual(['first', 'second'])

    for (let i = 0; i < 20; i += 1) pushLocalList('k', `item-${i}`, 5)
    expect(readLocalList('k')).toHaveLength(5)
    expect(readLocalList('k')[0]).toBe('item-19')
  })

  it('toggles membership without reordering what stays', () => {
    toggleLocalList('k', 'a')
    toggleLocalList('k', 'b')
    expect(readLocalList('k')).toEqual(['a', 'b'])

    toggleLocalList('k', 'a')
    expect(readLocalList('k')).toEqual(['b'])

    toggleLocalList('k', 'a')
    expect(readLocalList('k')).toEqual(['b', 'a'])
  })

  it('caps a toggled list at the limit, keeping the newest', () => {
    for (let i = 0; i < 5; i += 1) toggleLocalList('k', `s${i}`, 3)
    expect(readLocalList('k')).toEqual(['s2', 's3', 's4'])
  })

  it('degrades to an empty list when the stored value is not an array', () => {
    window.localStorage.setItem('k', '{"not":"an array"}')
    expect(readLocalList('k')).toEqual([])

    window.localStorage.setItem('k', 'not json at all')
    expect(readLocalList('k')).toEqual([])
  })

  it('drops entries that are not strings', () => {
    window.localStorage.setItem('k', '["a", 2, null, "b"]')
    expect(readLocalList('k')).toEqual(['a', 'b'])
  })

  it('returns an empty list on the server snapshot', () => {
    expect(getServerList()).toEqual([])
  })
})
