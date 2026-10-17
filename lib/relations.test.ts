import { describe, expect, it } from 'vitest'
import { entries } from '@/content/registry'
import { getStrongestPairs, getTriggerGraph, layoutGraph } from './relations'

/*
 * The relationship map is a claim about the catalog: these triggers really do
 * travel together. The tests keep the claim true and the picture stable.
 */
describe('relationship graph', () => {
  it('only makes nodes for triggers that clear the count', () => {
    const graph = getTriggerGraph(3, 2, 50)
    for (const node of graph.nodes) {
      const real = entries.filter((entry) => entry.triggers.includes(node.id)).length
      expect(node.count).toBe(real)
      expect(node.count).toBeGreaterThanOrEqual(3)
    }
  })

  it('never links two triggers that share no entry', () => {
    const graph = getTriggerGraph(2, 2, 50)
    const carriers = new Map<string, Set<string>>()
    for (const entry of entries) {
      for (const trigger of new Set(entry.triggers)) {
        const set = carriers.get(trigger) ?? new Set<string>()
        set.add(entry.slug)
        carriers.set(trigger, set)
      }
    }
    for (const edge of graph.edges) {
      const left = carriers.get(edge.a) ?? new Set<string>()
      const right = carriers.get(edge.b) ?? new Set<string>()
      const shared = [...left].filter((slug) => right.has(slug)).length
      expect(shared).toBe(edge.weight)
      expect(shared).toBeGreaterThanOrEqual(2)
    }
  })

  it('caps the node count so the drawing stays readable', () => {
    expect(getTriggerGraph(1, 1, 12).nodes.length).toBeLessThanOrEqual(12)
  })

  it('sorts nodes and edges by weight, deterministically', () => {
    const graph = getTriggerGraph(2, 2, 20)
    const counts = graph.nodes.map((node) => node.count)
    expect(counts).toEqual([...counts].sort((a, b) => b - a))

    const weights = graph.edges.map((edge) => edge.weight)
    expect(weights).toEqual([...weights].sort((a, b) => b - a))

    expect(getTriggerGraph(2, 2, 20)).toEqual(graph)
  })

  it('places every node inside the unit square, once', () => {
    const graph = getTriggerGraph(2, 2, 20)
    const placed = layoutGraph(graph)
    expect(placed).toHaveLength(graph.nodes.length)
    for (const node of placed) {
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(1)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(1)
      expect(node.r).toBeGreaterThan(0)
    }
    expect(new Set(placed.map((node) => node.id)).size).toBe(placed.length)
  })

  it('returns at most the requested number of strongest pairs, heaviest first', () => {
    const graph = getTriggerGraph(2, 2, 20)
    const pairs = getStrongestPairs(graph, 5)
    expect(pairs.length).toBeLessThanOrEqual(5)
    if (pairs.length > 1) {
      expect(pairs[0].weight).toBeGreaterThanOrEqual(pairs[pairs.length - 1].weight)
    }
  })
})
