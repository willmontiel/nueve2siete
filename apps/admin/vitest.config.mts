import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    // Need Postgres running (pnpm db).
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
