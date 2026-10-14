import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlossaryBrowser } from './glossary-browser'
import { queryGlossary } from '@/lib/glossary'

/*
 * The search island has one job that is easy to get wrong: it must not show
 * the server-rendered list at the same time as its own results. These tests
 * pin the idle state, the searching state, and the "see also" shortcut that
 * turns a reference into a new query.
 */
describe('GlossaryBrowser', () => {
  it('shows the server-rendered list and the total until a query is typed', () => {
    render(
      <GlossaryBrowser total={24}>
        <p>the server list</p>
      </GlossaryBrowser>,
    )

    expect(screen.getByText('the server list')).toBeInTheDocument()
    expect(screen.getByText('the server list').closest('[hidden]')).toBeNull()
    expect(screen.getByText('24 terms')).toBeInTheDocument()
  })

  it('hides the server list and reports matches while searching', async () => {
    const user = userEvent.setup()
    render(
      <GlossaryBrowser total={24}>
        <p>the server list</p>
      </GlossaryBrowser>,
    )

    await user.type(screen.getByRole('searchbox'), 'mcp')
    const matches = queryGlossary({ q: 'mcp' })

    expect(screen.getByText(` ${matches.length} of 24 terms `.trim())).toBeInTheDocument()
    expect(screen.getByText('the server list').closest('[hidden]')).not.toBeNull()
    // "MCP" can appear twice: once as a definition term and once as another
    // entry's "see also" reference. The definition term is the one that must
    // be present in the results.
    expect(screen.getAllByText('MCP').some((el) => el.tagName === 'DT')).toBe(true)
  })

  it('runs a "see also" reference through the same search box', async () => {
    const user = userEvent.setup()
    render(
      <GlossaryBrowser total={24}>
        <p>the server list</p>
      </GlossaryBrowser>,
    )

    await user.type(screen.getByRole('searchbox'), 'mcp')
    await user.click(screen.getByRole('button', { name: 'JSON-RPC' }))

    expect(screen.getByRole('searchbox')).toHaveValue('JSON-RPC')
    expect(screen.getByText('JSON-RPC')).toBeInTheDocument()
  })

  it('says so, plainly, when nothing matches', async () => {
    const user = userEvent.setup()
    render(
      <GlossaryBrowser total={24}>
        <p>the server list</p>
      </GlossaryBrowser>,
    )

    await user.type(screen.getByRole('searchbox'), 'zzzznotathing')
    expect(screen.getByText(/Nothing matches that search/)).toBeInTheDocument()
  })
})
