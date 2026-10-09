import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e'],
    css: false,
    // Parallel workers time out on busy machines (and in CI containers with
    // few cores). Two bounded workers keep runs reliable and still parallel.
    pool: 'threads',
    poolOptions: {
      threads: { minThreads: 1, maxThreads: 2 },
    },
  },
})
