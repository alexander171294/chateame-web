import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Regex aliases ordered specific → general. String aliases match by prefix,
    // so 'next-intl' would shadow 'next-intl/navigation' and '@' would shadow
    // '@/i18n/navigation'. Exact-match regexes avoid that shadowing.
    alias: [
      {
        find: /^next-intl\/navigation$/,
        replacement: path.resolve(__dirname, 'src/test/__mocks__/next-intl/navigation.tsx'),
      },
      {
        find: /^next-intl\/routing$/,
        replacement: path.resolve(__dirname, 'src/test/__mocks__/next-intl/routing.ts'),
      },
      {
        find: /^next-intl$/,
        replacement: path.resolve(__dirname, 'src/test/__mocks__/next-intl.tsx'),
      },
      {
        find: /^@\/i18n\/navigation$/,
        replacement: path.resolve(__dirname, 'src/test/__mocks__/next-intl/navigation.tsx'),
      },
      { find: /^@\//, replacement: path.resolve(__dirname, './src') + '/' },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    testTimeout: 15000,
    // Un solo fork serializa los archivos: evita el "worker exited unexpectedly"
    // por contención entre forks de jsdom (a costa de algo de velocidad).
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: [
        'src/lib/**',
        'src/components/**',
        'src/app/**/[A-Z]*.tsx',
      ],
      exclude: [
        'src/lib/types.ts',
        'src/lib/query-client.ts',
        'src/i18n/**',
        'src/app/**/page.tsx',
        'src/app/**/layout.tsx',
        'src/app/**/providers.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
});
