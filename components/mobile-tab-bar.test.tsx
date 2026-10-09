import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MobileTabBar } from './mobile-tab-bar'

/*
 * The tab bar is the app chrome on mobile, so its contract is small and worth
 * pinning: four tabs, the current route marked as current, and search opening
 * the command palette rather than navigating.
 */
vi.mock('next/navigation', () => ({
  usePathname: () => '/skills',
}))

const openPalette = vi.fn()
vi.mock('@/components/palette-provider', () => ({
  usePalette: () => ({ open: false, setOpen: openPalette, toggle: () => {} }),
}))

describe('MobileTabBar', () => {
  it('marks the active route with aria-current', () => {
    render(<MobileTabBar />)
    const skills = screen.getByRole('link', { name: 'Skills' })
    expect(skills).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('opens the command palette from the search tab', async () => {
    const user = userEvent.setup()
    render(<MobileTabBar />)
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(openPalette).toHaveBeenCalledWith(true)
  })

  it('opens external tabs in a new tab with safe rel', () => {
    render(<MobileTabBar />)
    const github = screen.getByRole('link', { name: 'GitHub' })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github.getAttribute('rel')).toContain('noreferrer')
  })
})
