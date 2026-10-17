import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StackChooser } from './stack-chooser'
import type { ChooserEntry } from '@/lib/chooser'
import type { Craft } from '@/content/registry'

/*
 * The chooser is the one surface where a reader makes choices, so the tests
 * follow those choices through: the default picks, a goal swap, a kind filter
 * that surfaces something new, and the reset that puts it all back. The catalog
 * here is a four-row fixture, not the real registry, so the assertions stay
 * about behaviour rather than about whatever the catalog happens to hold.
 */
const CATALOG: ChooserEntry[] = [
  {
    slug: 'ui-polish',
    name: 'UI Polish',
    kind: 'skill',
    kindLabel: 'Skill',
    craft: 'Design',
    tagline: 'Catch the defaults that make a page look generated.',
    command: 'npx ui-polish',
    featured: true,
  },
  {
    slug: 'data-bridge',
    name: 'Data Bridge',
    kind: 'mcp',
    kindLabel: 'MCP server',
    craft: 'DevEx',
    tagline: 'Let an agent read and write your data.',
    command: 'npx data-bridge',
  },
  {
    slug: 'search-api',
    name: 'Search API',
    kind: 'api',
    kindLabel: 'Public API',
    craft: 'Research',
    tagline: 'Search the open web from a function call.',
    command: 'curl search',
    license: 'MIT',
  },
  {
    slug: 'host-runner',
    name: 'Host Runner',
    kind: 'software',
    kindLabel: 'Free software',
    craft: 'DevEx',
    tagline: 'Run the whole thing yourself.',
    command: 'docker run host-runner',
  },
]

const CRAFTS: Craft[] = ['Design', 'DevEx', 'Research'] as const
const KIND_OPTIONS = [
  { value: 'skill' as const, label: 'Skill' },
  { value: 'mcp' as const, label: 'MCP server' },
  { value: 'api' as const, label: 'Public API' },
  { value: 'software' as const, label: 'Free software' },
]

function renderChooser() {
  return render(<StackChooser catalog={CATALOG} crafts={CRAFTS} kindOptions={KIND_OPTIONS} />)
}

describe('StackChooser', () => {
  it('starts on the first goal with only the entries that fit it', () => {
    renderChooser()
    expect(screen.getByText('1 pick')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'UI Polish' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Data Bridge' })).not.toBeInTheDocument()
  })

  it('explains why an entry surfaced', () => {
    renderChooser()
    expect(screen.getByText(/fits the Design craft this goal leans on/i)).toBeInTheDocument()
  })

  it('re-scores when the goal changes', async () => {
    const user = userEvent.setup()
    renderChooser()
    await user.click(screen.getByRole('button', { name: /Connect an agent to data/i }))
    expect(screen.getByText('4 picks')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Data Bridge' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Search API' })).toBeInTheDocument()
  })

  it('surfaces a kind when the reader says they will run it', async () => {
    const user = userEvent.setup()
    renderChooser()
    expect(screen.queryByRole('link', { name: 'Data Bridge' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'MCP server' }))
    expect(screen.getByRole('link', { name: 'Data Bridge' })).toBeInTheDocument()
  })

  it('resets every answer back to the start', async () => {
    const user = userEvent.setup()
    renderChooser()
    await user.click(screen.getByRole('button', { name: /Connect an agent to data/i }))
    expect(screen.getByText('4 picks')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByText('1 pick')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Data Bridge' })).not.toBeInTheDocument()
  })

  it('offers the shortlist as a script and as Markdown', () => {
    renderChooser()
    expect(screen.getByRole('button', { name: /copy the setup script/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy the stack as markdown/i })).toBeInTheDocument()
  })

  it('marks the chosen goal and craft for assistive tech', async () => {
    const user = userEvent.setup()
    renderChooser()
    expect(screen.getByRole('button', { name: /Ship a polished interface/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(screen.getByRole('button', { name: 'DevEx' }))
    expect(screen.getByRole('button', { name: 'DevEx' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Any craft' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
