'use client'

import { useState } from 'react'

/**
 * The relationship map: nodes are triggers, edges join triggers that appear on
 * the same entry.
 *
 * The positions are computed on the server and passed in, so this island does
 * no maths and stays tiny. Its whole job is interaction: hovering or focusing a
 * node dims everything it is not connected to and swaps the side panel to that
 * trigger. It never mutates data, so it is safe under React strict mode and it
 * renders a complete picture even before a pointer arrives.
 */

export interface MapNode {
  id: string
  label: string
  count: number
  craft: string | null
  /** Normalised 0..1 coordinates. */
  x: number
  y: number
  /** Normalised radius. */
  r: number
  entries: Array<{ slug: string; name: string }>
}

export interface MapEdge {
  a: string
  b: string
  weight: number
}

function connected(edges: MapEdge[], id: string): Set<string> {
  const set = new Set<string>()
  for (const edge of edges) {
    if (edge.a === id) set.add(edge.b)
    if (edge.b === id) set.add(edge.a)
  }
  return set
}

export function RelationshipMap({ nodes, edges }: { nodes: MapNode[]; edges: MapEdge[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const active = hovered ? connected(edges, hovered) : null
  const activeNode = hovered ? nodes.find((node) => node.id === hovered) : null

  const isLit = (id: string) => hovered === null || hovered === id || active?.has(id) === true

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="border-line bg-surface rounded-2xl border p-2 sm:p-4">
        <svg
          viewBox="0 0 1 1"
          className="h-auto w-full"
          role="img"
          aria-label={`Map of ${nodes.length} triggers connected by ${edges.length} shared entries`}
        >
          {edges.map((edge) => {
            const from = nodes.find((node) => node.id === edge.a)
            const to = nodes.find((node) => node.id === edge.b)
            if (!from || !to) return null
            const lit = hovered === null || edge.a === hovered || edge.b === hovered
            return (
              <line
                key={`${edge.a}-${edge.b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="stroke-muted"
                strokeWidth={0.001 + 0.0015 * edge.weight}
                opacity={lit ? Math.min(0.15 + edge.weight * 0.06, 0.75) : 0.04}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}

          {nodes.map((node) => {
            const angle = Math.atan2(node.y - 0.5, node.x - 0.5)
            const cos = Math.cos(angle)
            const offset = node.r + 0.012
            const labelX = node.x + offset * cos
            const labelY = node.y + offset * Math.sin(angle)
            const anchor = cos >= 0 ? 'start' : 'end'
            return (
              <g
                key={node.id}
                tabIndex={0}
                role="button"
                aria-label={`${node.label}: appears on ${node.count} entries`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  className="fill-accent"
                  opacity={isLit(node.id) ? 0.9 : 0.2}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className="fill-ink"
                  fontSize={0.028}
                  opacity={isLit(node.id) ? 1 : 0.25}
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <aside className="border-line bg-elevated rounded-2xl border p-5" aria-live="polite">
        {activeNode ? (
          <div>
            <p className="text-muted font-mono text-[11px] tracking-[0.14em] uppercase">Trigger</p>
            <h2 className="text-ink mt-1 text-2xl font-semibold tracking-tight">
              {activeNode.label}
            </h2>
            <p className="text-muted mt-1 text-sm">
              On {activeNode.count} {activeNode.count === 1 ? 'entry' : 'entries'}
              {activeNode.craft ? `, mostly ${activeNode.craft}` : ''}.
            </p>
            <ul className="mt-4 space-y-1">
              {activeNode.entries.slice(0, 8).map((entry) => (
                <li key={entry.slug}>
                  <a
                    href={`/skills/${entry.slug}`}
                    className="text-ink text-sm hover:underline hover:underline-offset-4"
                  >
                    {entry.name}
                  </a>
                </li>
              ))}
            </ul>
            {activeNode.entries.length > 8 && (
              <p className="text-muted mt-2 text-sm">and {activeNode.entries.length - 8} more.</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-muted font-mono text-[11px] tracking-[0.14em] uppercase">
              Relationship map
            </p>
            <p className="text-ink mt-2 leading-relaxed">
              Hover or focus a trigger to see what travels with it.
            </p>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Each dot is a trigger. The lines join triggers that show up on the same entry,
              thickened by how often they share one.
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
