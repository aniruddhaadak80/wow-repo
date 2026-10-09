import { describe, expect, it } from 'vitest'
import { curves } from './curves'

/*
 * The curves carry the intelligence-explosion argument, so a bad axis is a
 * dishonest argument. These tests keep the plots honest: the tick grid must
 * sit inside the declared domain, a log series must not cross zero, and every
 * plotted point must fall inside the plot area.
 */
describe('curve series integrity', () => {
  it('has at least one series', () => {
    expect(curves.length).toBeGreaterThan(0)
  })

  it('uses unique ids', () => {
    const ids = curves.map((series) => series.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps every tick inside the declared domain', () => {
    for (const series of curves) {
      for (const tick of series.yTicks) {
        expect(tick.value, `${series.id} / ${tick.label}`).toBeGreaterThanOrEqual(series.domain[0])
        expect(tick.value, `${series.id} / ${tick.label}`).toBeLessThanOrEqual(series.domain[1])
      }
    }
  })

  it('never runs a log domain through zero', () => {
    for (const series of curves) {
      if (series.scale !== 'log') continue
      expect(series.domain[0], series.id).toBeGreaterThan(0)
      for (const point of series.points) {
        expect(point.value, `${series.id} / ${point.label}`).toBeGreaterThan(0)
      }
    }
  })

  it('keeps every plotted point inside the domain', () => {
    for (const series of curves) {
      for (const point of series.points) {
        expect(point.value, `${series.id} / ${point.label}`).toBeGreaterThanOrEqual(
          series.domain[0],
        )
        expect(point.value, `${series.id} / ${point.label}`).toBeLessThanOrEqual(series.domain[1])
      }
    }
  })

  it('gives every series a source, a caption, and a y-axis unit', () => {
    for (const series of curves) {
      expect(series.caption.length, series.id).toBeGreaterThan(0)
      expect(series.unit.length, series.id).toBeGreaterThan(0)
      expect(series.source.url, series.id).toMatch(/^https:\/\/[^\s]+$/)
    }
  })

  it('gives every point a label and a human-readable value', () => {
    for (const series of curves) {
      for (const point of series.points) {
        expect(point.label.length, series.id).toBeGreaterThan(0)
        expect(point.display.length, series.id).toBeGreaterThan(0)
      }
    }
  })

  it('keeps the linear series inside 0-100 percent', () => {
    for (const series of curves) {
      if (series.scale !== 'linear') continue
      for (const point of series.points) {
        expect(point.value, `${series.id} / ${point.label}`).toBeGreaterThanOrEqual(0)
        expect(point.value, `${series.id} / ${point.label}`).toBeLessThanOrEqual(100)
      }
    }
  })

  it('has no em-dashes or en-dashes in any user-visible string', () => {
    const visible = curves.flatMap((series) => [
      series.title,
      series.unit,
      series.caption,
      series.source.label,
      ...series.points.map((point) => `${point.label} ${point.display} ${point.note ?? ''}`),
    ])
    for (const text of visible) {
      expect(text).not.toContain('\u2014')
      expect(text).not.toContain('\u2013')
    }
  })
})
