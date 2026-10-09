/*
 * Metadata routes are static by nature. The literal config is also what the
 * GitHub Pages static export needs: route segment config cannot be computed,
 * so it is written once and read by both deploy targets.
 */
export const revalidate = 3600

/*
 * Colors below are the dark-mode tokens from app/globals.css, inlined because
 * ImageResponse cannot read CSS variables:
 *   #0b0b0c = --bg, #f4f4f5 = --ink, #bef264 = --accent,
 *   #1a2e05 = --on-accent, #a1a1aa = --muted, #26262a = --line.
 */
import { ImageResponse } from 'next/og'

// Static metadata route: revalidated hourly, and required for the GitHub Pages
// static export, which refuses a route with no literal segment config.
export const alt = 'wow-repo: a showcase of curated agent skills'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CATEGORIES = ['Design', 'DevEx', 'Content', 'Research', 'Multimedia']

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#0b0b0c',
        color: '#f4f4f5',
        padding: 80,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: '#bef264',
            color: '#1a2e05',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 40,
            fontFamily: 'monospace',
          }}
        >
          w
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 40,
            fontWeight: 600,
            fontFamily: 'monospace',
            letterSpacing: -1,
          }}
        >
          <span>wow</span>
          <span style={{ color: '#bef264' }}>*</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: -3,
          marginTop: 72,
        }}
      >
        Agent skills that ship.
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 44,
          marginTop: 20,
        }}
      >
        <span style={{ color: '#a1a1aa' }}>Sites that </span>
        <span style={{ color: '#bef264' }}>wow</span>
        <span style={{ color: '#a1a1aa' }}>.</span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 72 }}>
        {CATEGORIES.map((category) => (
          <div
            key={category}
            style={{
              display: 'flex',
              border: '1px solid #26262a',
              borderRadius: 999,
              padding: '8px 18px',
              fontSize: 18,
              fontFamily: 'monospace',
              color: '#a1a1aa',
            }}
          >
            {category}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  )
}
