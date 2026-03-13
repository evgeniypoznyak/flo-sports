import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    root: resolve(__dirname),
  },
  resolve: {
    alias: {
      '@flo-sports/shared': resolve(__dirname, '../../libs/shared/src/index.ts'),
    },
  },
});
