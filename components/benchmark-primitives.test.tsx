import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Efficiency, Meter, StatTile, SuiteTable } from './benchmark-primitives'
import { getEntryById } from '@/lib/benchmarks'

const entry = getEntryById('claude-sonnet-4-5')!
const freeEntry = { ...entry, cost: 0 }

describe('Meter', () => {
  it('exposes the value to assistive tech, not just the width', () => {
    render(<Meter value={76.3} label="Composite score" />)
    const bar = screen.getByRole('img', { name: 'Composite score: 76.3' })
    expect(bar).toHaveStyle({ width: '76.3%' })
  })

  it('clamps out-of-range values instead of overflowing the row', () => {
    const { rerender } = render(<Meter value={140} label="Over" />)
    expect(screen.getByRole('img')).toHaveStyle({ width: '100%' })

    rerender(<Meter value={-12} label="Under" />)
    expect(screen.getByRole('img')).toHaveStyle({ width: '0%' })
  })

  it('scales against a custom maximum', () => {
    render(<Meter value={50} max={200} label="Half" />)
    expect(screen.getByRole('img')).toHaveStyle({ width: '25%' })
  })
})

describe('StatTile', () => {
  it('renders a label, a value, and an optional hint', () => {
    render(<StatTile label="latency" value="38.4s" hint="median per completed task" />)
    expect(screen.getByText('latency')).toBeInTheDocument()
    expect(screen.getByText('38.4s')).toBeInTheDocument()
    expect(screen.getByText('median per completed task')).toBeInTheDocument()
  })

  it('omits the hint entirely when not provided', () => {
    render(<StatTile label="runs" value={14} />)
    expect(screen.getByText('runs')).toBeInTheDocument()
  })
})

describe('SuiteTable', () => {
  it('lists every suite with its score', () => {
    render(<SuiteTable suites={entry.breakdown} />)

    for (const suite of entry.breakdown) {
      expect(screen.getByText(suite.label)).toBeInTheDocument()
    }
    expect(
      screen.getByRole('img', { name: `SWE-bench Verified: ${entry.breakdown[0].score}` }),
    ).toBeInTheDocument()
  })

  it('renders an empty list without crashing', () => {
    const { container } = render(<SuiteTable suites={[]} />)
    expect(container.querySelectorAll('dt')).toHaveLength(0)
  })
})

describe('Efficiency', () => {
  it('shows score per cent and explains the arithmetic', () => {
    render(<Efficiency entry={entry} />)
    const expected = (entry.score / entry.cost).toFixed(1)
    expect(screen.getByText(expected)).toBeInTheDocument()
    expect(screen.getByText(`76.3 composite at $0.42 per task`)).toBeInTheDocument()
  })

  it('never renders Infinity for a free run', () => {
    render(<Efficiency entry={freeEntry} />)
    expect(screen.queryByText(/Infinity/)).not.toBeInTheDocument()
    expect(screen.getByText('free')).toBeInTheDocument()
  })
})
