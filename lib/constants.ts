/**
 * Repo URL. Env-overridable so a fork renders its own links without forking
 * the source, and trailing slashes are stripped so callers can concatenate.
 */
const REPO = (
  process.env.NEXT_PUBLIC_REPO_URL || 'https://github.com/aniruddhaadak80/wow-repo'
).replace(/\/+$/, '')

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wow-repo.vercel.app'

export const GITHUB_URL = REPO

/** Label search survives issue renumbering; hardcoded links do not. */
export const ISSUES_URL = `${REPO}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`

/** The one accent hue. Do not add a second. */
export const ACCENT = '#bef264'

/** Z-index scale. Everything lives here; no ad-hoc z values in components. */
export const Z = {
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const

/** The single easing curve used for UI motion. */
export const EASE = [0.16, 1, 0.3, 1] as const

export const TRIGGER_KEYS = ['cmd', 'ctrl'] as const
