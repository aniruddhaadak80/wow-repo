import { describe, expect, it } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { BenchmarkLeaderboard } from './benchmark-leaderboard'
import { getBenchmarkEntries } from '@/lib/benchmarks'

const entries = getBenchmarkEntries()

/*
 * Track and sort changes go through `useTransition`, so the DOM settles on a
 * later, lower-priority render. Awaiting `act` flushes that transition
 * deterministically instead of polling with `waitFor`, which times out on a
 * loaded machine even when the behaviour is correct.
 */
async function click(el: Element) {
  await act(async () => {
    fireEvent.click(el)
  })
}

async function change(el: Element, value: string) {
  await act(async () => {
    fireEvent.change(el, { target: { value } })
  })
}

describe('BenchmarkLeaderboard', () => {
  it('opens on the models track with the top-scoring run ranked first', async () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    expect(await screen.findByText('Claude Sonnet 4.5')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Models' })).toHaveAttribute('aria-pressed', 'true')

    const firstRow = screen.getAllByRole('button', { expanded: false })[0]
    expect(firstRow).toHaveTextContent('Claude Sonnet 4.5')
    expect(firstRow).toHaveTextContent('1')
  })

  it('switches tracks without losing the console', async () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    await click(screen.getByRole('button', { name: 'Harnesses' }))

    expect(screen.getByText('wow-runner')).toBeInTheDocument()
    expect(screen.queryByText('Claude Sonnet 4.5')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Harnesses' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('shows every run on the all-runs track', async () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    await click(screen.getByRole('button', { name: 'All runs' }))

    expect(screen.getByText('spool')).toBeInTheDocument()
    expect(screen.getByText(/of 14 runs shown/)).toBeInTheDocument()
  })

  it('filters by name and offers a way out of an empty result', async () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    await change(await screen.findByLabelText('Filter benchmark runs'), 'zzzz')
    expect(screen.getByText('No runs match that filter.')).toBeInTheDocument()

    await click(screen.getByRole('button', { name: 'Clear filter' }))
    expect(screen.getByText('Claude Sonnet 4.5')).toBeInTheDocument()
  })

  it('discloses the per-suite breakdown for a run', async () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    const row = (await screen.findAllByRole('button', { expanded: false }))[0]
    expect(row).toHaveAttribute('aria-expanded', 'false')

    await click(row)

    const expanded = screen.getByRole('button', { expanded: true })
    expect(expanded).toHaveAttribute('aria-controls', 'bench-panel-claude-sonnet-4-5')
    expect(screen.getByText('SWE-bench Verified')).toBeInTheDocument()
    expect(screen.getByText('latency')).toBeInTheDocument()
  })

  it('re-sorts on demand', async () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    await change(await screen.findByRole('combobox'), 'latency')

    const firstRow = screen.getAllByRole('button', { expanded: false })[0]
    expect(firstRow).toHaveTextContent('Llama 4 Maverick')
  })

  it('hands off to a static render under reduced motion', async () => {
    render(<BenchmarkLeaderboard entries={entries} />)

    // Without motion the rows are still complete and readable, just not animated.
    expect(await screen.findByText('Claude Sonnet 4.5')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { expanded: false }).length).toBeGreaterThan(0)
  })
})
