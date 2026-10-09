/*
 * The in-repo documentation, rendered at /docs.
 *
 * This is real prose about this codebase, not marketing copy: every claim
 * names a file. Nothing here is sample data, so nothing needs a disclaimer.
 */

export interface DocCodeBlock {
  label: string
  source: string
}

export interface DocSection {
  heading: string
  body: string
  code?: DocCodeBlock[]
}

export interface DocPage {
  slug: string
  title: string
  group: 'Architecture' | 'Design system' | 'Deploy' | 'Quality'
  summary: string
  sections: DocSection[]
}

export const docs: DocPage[] = [
  {
    slug: 'architecture',
    title: 'How the build is put together',
    group: 'Architecture',
    summary:
      'Next.js App Router, server components by default, and one typed content module behind every page.',
    sections: [
      {
        heading: 'Server first, client only where it moves',
        body: 'Every page is a server component that reads typed content through lib/. Interactivity lives in small client leaves: the catalog search, the phone app, the compare board, the command palette, this dialog. Nothing else ships JavaScript for state.',
        code: [
          {
            label: 'app/docs/page.tsx',
            source: `export default function DocsPage() {
  const pages = getDocPages()
  return <DocShell pages={pages} />
}`,
          },
        ],
      },
      {
        heading: 'Content is data, not markup',
        body: 'Registry entries, benchmarks, findings, and this documentation are TypeScript modules with explicit interfaces. A test next to each one enforces the invariants, so a malformed entry fails CI rather than the page.',
        code: [
          {
            label: 'lib/registry.ts',
            source: `export function getEntries(): RegistryEntry[] {
  return entries
}`,
          },
        ],
      },
      {
        heading: 'No component library, on purpose',
        body: 'The interactive pieces are owned code. That keeps the bundle small, the accessibility surface auditable, and every component replaceable without fighting a dependency.',
      },
    ],
  },
  {
    slug: 'design-system',
    title: 'The design system in one page',
    group: 'Design system',
    summary:
      'One accent hue, one radius scale, one easing curve, one z-index scale, all defined once in code.',
    sections: [
      {
        heading: 'Tokens live in CSS variables',
        body: 'app/globals.css defines the palette per mode and maps it into Tailwind v4 through @theme inline. Components never hardcode a color, so a theme change is a token change.',
        code: [
          {
            label: 'app/globals.css',
            source: `:root {
  --bg: #fafaf9;
  --accent: #4d7c0f;
  --on-accent: #ffffff;
}

[data-theme='dark'] {
  --bg: #0b0b0c;
  --accent: #bef264;
  --on-accent: #1a2e05;
}`,
          },
        ],
      },
      {
        heading: 'Shape consistency is a rule, not a preference',
        body: 'Interactive elements are pills, cards and tiles are 16px, chips and inputs are 8px. The scale is written down in globals.css so a review can check it mechanically.',
      },
      {
        heading: 'One z-index scale',
        body: 'lib/constants.ts owns every layer: dropdown 100, sticky 200, overlay 300, modal 400, toast 500. Components import the constant instead of inventing a value.',
        code: [
          {
            label: 'lib/constants.ts',
            source: `export const Z = {
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const`,
          },
        ],
      },
    ],
  },
  {
    slug: 'motion',
    title: 'Motion that has a reason',
    group: 'Design system',
    summary:
      'Transform and opacity only, one easing curve, and a reduced-motion path that is a design rather than a fallback.',
    sections: [
      {
        heading: 'Every animation answers a question',
        body: 'The phone navigates because you tapped it. The numbers count up once when they enter view. The swarm reports as agents finish. Nothing moves to fill space, and infinite loops are limited to the one marquee under the hero.',
      },
      {
        heading: 'Reduced motion is a first-class mode',
        body: 'useReducedMotion gates every client component. Under reduce, timed sequences jump to their final state and transitions collapse to a fade. CSS animations are disabled in globals.css for the same reason.',
        code: [
          {
            label: 'components/phone-app.tsx',
            source: `const reduce = useReducedMotion()
const transition = reduce ? { duration: 0.01 } : { duration: 0.3, ease: [...EASE] }`,
          },
        ],
      },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility as a build gate',
    group: 'Quality',
    summary:
      'Focus rings, labelled controls, contrast, and a keyboard path for every interactive surface.',
    sections: [
      {
        heading: 'Visible focus, everywhere',
        body: 'A single :focus-visible rule in globals.css outlines with the accent color and a 2px offset. No component removes it, so keyboard users always see where they are.',
      },
      {
        heading: 'Icon-only controls carry labels',
        body: 'Buttons that show an icon use aria-label, and links that leave the site carry rel="noreferrer noopener". The mobile tab bar marks the current route with aria-current so screen readers announce position, not just destination.',
      },
      {
        heading: 'Both themes are designed, not inverted',
        body: 'Light and dark each get their own token set with the same hierarchy. Text keeps AA contrast in both, and the device chrome in the phone mockup stays dark in both because hardware does not change with the theme.',
      },
    ],
  },
  {
    slug: 'deploy',
    title: 'Two deploy targets, one codebase',
    group: 'Deploy',
    summary:
      'Vercel runs the full app. GitHub Pages runs a static export. A single environment variable decides which.',
    sections: [
      {
        heading: 'The switch is one flag',
        body: 'GH_PAGES=true makes next.config.ts emit a fully static site with the repo-name basePath and no image optimizer, because Pages has no server. Vercel builds leave it unset and keep ISR, the JSON APIs, and image optimization.',
        code: [
          {
            label: 'next.config.ts',
            source: `const isPagesExport = process.env.GH_PAGES === 'true'
const pagesBasePath = isPagesExport ? '/wow-repo' : ''

const nextConfig: NextConfig = {
  ...(isPagesExport && { output: 'export' }),
  ...(pagesBasePath && { basePath: pagesBasePath, assetPrefix: pagesBasePath }),
}`,
          },
        ],
      },
      {
        heading: 'Route config has to be literal',
        body: 'Next parses route segment config statically, so dynamic and revalidate cannot be computed. The metadata routes and the health endpoint carry a literal revalidate, which the static export requires, and the data routes read the request only when a server is there to answer.',
      },
      {
        heading: 'What the static export gives up',
        body: 'Query-string APIs. Pages cannot execute code, so the exported data routes are build artifacts rather than live endpoints. Everything a visitor reads is prerendered HTML either way.',
      },
    ],
  },
  {
    slug: 'quality-gates',
    title: 'What has to pass before merge',
    group: 'Quality',
    summary:
      'One command runs five checks, and CI runs the same command on every push and pull request.',
    sections: [
      {
        heading: 'The gate',
        body: 'bun run check runs typecheck, lint, format check, the test suite, and a production build. A failure in any one of them is a merge blocker, including formatting.',
        code: [
          {
            label: 'package.json',
            source: `"check": "tsc --noEmit && eslint . && prettier --check . && vitest run && next build"`,
          },
        ],
      },
      {
        heading: 'Tests cover data and behavior',
        body: 'Dataset tests assert invariants like unique slugs, in-range scores, and internals that agree with their own breakdowns. Component tests cover the pieces with contracts worth pinning: the tab bar marks the current route, the palette search filters, the compare board rejects duplicates.',
      },
      {
        heading: 'Lighthouse in CI',
        body: '.github/workflows/lighthouse.yml audits the production URL on every push to main and fails the run if performance, accessibility, or best practices regress below the thresholds in .lighthouserc.json.',
      },
    ],
  },
]

export const DOC_GROUPS = ['Architecture', 'Design system', 'Quality', 'Deploy'] as const
