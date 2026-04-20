import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  test: {
    name: 'playground',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,mts,cts,js,mjs,cjs,jsx,tsx}'],
    reporters: ['default'],
  },
});
