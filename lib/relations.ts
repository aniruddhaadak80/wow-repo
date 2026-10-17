import { entries } from '@/content/registry'
import type { Craft } from '@/content/registry'

/**
 * The relationship map: which problems travel together.
 *
 * Each node is a trigger, sized by how many entries carry it. Each edge joins
 * two triggers that appear on the same entry, weighted by how often. It is a
 * question the flat registry cannot answer on its own ("what goes with
 * retrieval?"), and it is computed here rather than drawn by hand, so it stays
 * true as the catalog grows.
 *
 * The layout is deterministic too: a fixed circle, ordered by weight, so the
 * same catalog always renders the same picture and a screenshot never drifts.
 */

export interface TriggerNode {
  id: string
  label: string
  /** How many entries carry this trigger. */
  count: number
  /** The craft most of those entries belong to, for colour grouping. */
  craft: Craft | null
}

export interface TriggerEdge {
  a: string
  b: string
  /** How many entries carry both triggers. */
  weight: number
}

export interface TriggerGraph {
  nodes: TriggerNode[]
  edges: TriggerEdge[]
}

function dominantCraft(trigger: string): Craft | null {
  const counts = new Map<Craft, number>()
  for (const entry of entries) {
    if (!entry.triggers.includes(trigger)) continue
    counts.set(entry.craft, (counts.get(entry.craft) ?? 0) + 1)
  }
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]
  return best ? best[0] : null
}

/**
 * The strongest trigger associations in the catalog. Triggers must appear on at
 * least `minCount` entries to earn a node, and a pair must appear together at
 * least `minWeight` times to earn an edge, which keeps the picture readable.
 */
export function getTriggerGraph(minCount = 2, minWeight = 2, maxNodes = 22): TriggerGraph {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    for (const trigger of entry.triggers) {
      counts.set(trigger, (counts.get(trigger) ?? 0) + 1)
    }
  }

  const nodes: TriggerNode[] = [...counts.entries()]
    .filter(([, count]) => count >= minCount)
    .map(([id, count]) => ({ id, label: id, count, craft: dominantCraft(id) }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
    .slice(0, maxNodes)

  const keep = new Set(nodes.map((node) => node.id))
  const weights = new Map<string, number>()
  for (const entry of entries) {
    const shared = [...new Set(entry.triggers)].filter((trigger) => keep.has(trigger)).sort()
    for (let i = 0; i < shared.length; i += 1) {
      for (let j = i + 1; j < shared.length; j += 1) {
        const key = `${shared[i]}\u0000${shared[j]}`
        weights.set(key, (weights.get(key) ?? 0) + 1)
      }
    }
  }

  const edges: TriggerEdge[] = [...weights.entries()]
    .map(([key, weight]) => {
      const [a, b] = key.split('\u0000')
      return { a, b, weight }
    })
    .filter((edge) => edge.weight >= minWeight)
    .sort((a, b) => b.weight - a.weight || a.a.localeCompare(b.a) || a.b.localeCompare(b.b))

  return { nodes, edges }
}

export interface PlacedNode extends TriggerNode {
  /** Normalised 0..1 coordinates for a 1x1 viewBox. */
  x: number
  y: number
  /** Normalised radius. */
  r: number
}

/**
 * A deterministic circular layout. Nodes sit on a ring ordered by weight, with
 * alternating radii so labels on neighbouring nodes do not collide. No physics,
 * no randomness: the same graph always lands in the same place.
 */
export function layoutGraph(graph: TriggerGraph, radius = 0.4): PlacedNode[] {
  const count = graph.nodes.length
  const heaviest = graph.nodes.reduce((max, node) => Math.max(max, node.count), 1)
  return graph.nodes.map((node, index) => {
    const angle = (index / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2
    const ring = index % 2 === 0 ? radius : radius * 0.8
    return {
      ...node,
      x: 0.5 + ring * Math.cos(angle),
      y: 0.5 + ring * Math.sin(angle),
      r: 0.012 + 0.024 * (node.count / heaviest),
    }
  })
}

/** The strongest pairs, for the table that sits under the picture. */
export function getStrongestPairs(graph: TriggerGraph, count = 8): TriggerEdge[] {
  return graph.edges.slice(0, count)
}
