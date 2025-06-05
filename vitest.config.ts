import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/tests/**/*.test.ts'],
    setupFiles: ['server/tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './shared'),
    },
  },
}); 