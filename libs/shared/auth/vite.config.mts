import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/libs/shared/auth',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: '@react-storefront-architecture/auth',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: (id) => /^(react|react-dom)(\/|$)/.test(id),
    },
    outDir: './dist',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
  },
  test: {
    name: '@react-storefront-architecture/auth',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
