import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

/*
 * jsdom ships no matchMedia and no IntersectionObserver. Motion reads both,
 * so both are stubbed here. The matchMedia stub reports "no preference",
 * which is the same branch a normal desktop browser takes.
 */
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

if (!('IntersectionObserver' in window)) {
  /*
   * Deliberately not declared as `implements IntersectionObserver`. That
   * interface gains members as TypeScript and @types/node move, and a
   * structural implements turns each bump into a build failure. Motion only
   * calls observe, unobserve, disconnect, and takeRecords, so those are all
   * this has to provide.
   */
  class NoopIntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  const Stub = NoopIntersectionObserver as unknown as {
    new (): IntersectionObserver
    prototype: IntersectionObserver
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: Stub,
  })
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    value: Stub,
  })
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
