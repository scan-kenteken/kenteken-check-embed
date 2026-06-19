import { defineConfig } from 'tsup'

const shared = {
  platform: 'browser' as const,
  target: 'es2020' as const,
  minify: true,
  treeshake: true,
  sourcemap: true,
  outDir: 'dist',
}

export default defineConfig([
  {
    ...shared,
    entry: { embed: 'src/embed.ts' },
    format: ['iife'],
    clean: true,
    outExtension: () => ({ js: '.js' }),
  },
  {
    ...shared,
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    clean: false,
    dts: true,
    outExtension: () => ({ js: '.js' }),
  },
])
