import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookmarkButton } from './bookmark-button'

describe('BookmarkButton', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the unsaved state first, matching the server snapshot', () => {
    render(<BookmarkButton slug="abc" name="Design Taste" />)
    const button = screen.getByRole('button', { name: /save/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveTextContent('Save')
  })

  it('flips to pressed and reports the saved label when clicked', async () => {
    const user = userEvent.setup()
    render(<BookmarkButton slug="abc" name="Design Taste" />)

    await user.click(screen.getByRole('button'))
    const pressed = screen.getByRole('button', { name: /saved/i })
    expect(pressed).toHaveAttribute('aria-pressed', 'true')
    expect(pressed).toHaveTextContent('Saved')
  })

  it('reads back what it stored, so a reload keeps the entry saved', async () => {
    const user = userEvent.setup()
    render(<BookmarkButton slug="abc" name="Design Taste" />)
    await user.click(screen.getByRole('button'))

    expect(window.localStorage.getItem('wow-bookmarks')).toBe(JSON.stringify(['abc']))

    render(<BookmarkButton slug="abc" name="Design Taste" />)
    expect(screen.getAllByRole('button', { name: /saved/i })[0]).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('toggles the other way on a second click', async () => {
    const user = userEvent.setup()
    render(<BookmarkButton slug="abc" name="Design Taste" />)

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button', { name: /saved/i }))
    expect(window.localStorage.getItem('wow-bookmarks')).toBe(JSON.stringify([]))
    expect(screen.getByRole('button', { name: /save/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('keeps the entry name reachable by screen reader only', () => {
    render(<BookmarkButton slug="abc" name="Design Taste" />)
    const button = screen.getByRole('button', { name: 'Save Design Taste' })
    expect(button).toBeTruthy()
  })
})
