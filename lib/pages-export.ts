/**
 * True when the build targets GitHub Pages as a fully static export.
 *
 * Route handlers and page configs use this to pick a static-friendly value:
 * `force-dynamic` and `revalidate` have no meaning without a server, and Next
 * refuses to export a route that asks for them. Vercel builds never set
 * `GH_PAGES`, so they keep the live behavior.
 */
export const IS_PAGES_EXPORT = process.env.GH_PAGES === 'true'

/** The base path GitHub Pages serves this project from. */
export const PAGES_BASE_PATH = IS_PAGES_EXPORT ? '/wow-repo' : ''
