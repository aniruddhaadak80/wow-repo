/*
 * Reduced-motion behaviour lives in its own file on purpose.
 *
 * Motion reads the preference once into a module-level singleton and keeps the
 * MediaQueryList it read, so stubbing `window.matchMedia` after the first
 * motion component mounts has no effect. Mocking the hook is the only way to
 * exercise the static branch deterministically.
 */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  return {
    ...actual,
    useReducedMotion: () => true,
  }
})

const { BenchmarkLeaderboard } = await import('./benchmark-leaderboard')
const { getBenchmarkEntries } = await import('@/lib/benchmarks')

const entries = getBenchmarkEntries()

describe('BenchmarkLeaderboard under prefers-reduced-motion', () => {
  it('renders every score bar at its final width with no transform', () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    const bars = document.querySelectorAll('span[style*="width:"]')
    expect(bars.length).toBe(getLlmCount())

    for (const bar of bars) {
      const style = bar.getAttribute('style') ?? ''
      expect(style).toMatch(/width: \d+(\.\d+)?%/)
      expect(style).not.toContain('transform')
    }
  })

  it('shows the real best score instead of counting up', () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    // 76.3 appears exactly twice: the "best" summary cell (final value on the
    // first paint) and the rank-one row. Nothing is stuck counting from zero.
    expect(screen.getAllByText('76.3')).toHaveLength(2)
    expect(screen.queryByText('0.0')).not.toBeInTheDocument()
  })

  it('still renders the rows and the disclosure control', () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    expect(screen.getByText('Claude Sonnet 4.5')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(getLlmCount())
  })
})

function getLlmCount() {
  return entries.filter((entry) => entry.track === 'llm').length
}
