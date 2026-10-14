import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SavedBadge } from './saved-badge'

/*
 * The badge is the only place the mobile chrome reads local state, so its
 * contract is worth pinning: nothing when the shelf is empty, the live count
 * otherwise, and never a second accessible name on the tab.
 */
describe('SavedBadge', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders nothing when no entries are saved', () => {
    const { container } = render(<SavedBadge />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the live count once entries are saved', () => {
    window.localStorage.setItem('wow-bookmarks', JSON.stringify(['a', 'b', 'c']))
    render(<SavedBadge />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('keeps the decoration out of the accessibility tree', () => {
    window.localStorage.setItem('wow-bookmarks', JSON.stringify(['a']))
    render(<SavedBadge />)
    expect(screen.getByText('1')).toHaveAttribute('aria-hidden', 'true')
  })
})
