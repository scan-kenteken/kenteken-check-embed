import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { embed: 'src/embed.ts' },
  format: ['iife'],
  platform: 'browser',
  target: 'es2020',
  minify: true,
  treeshake: true,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  outExtension: () => ({ js: '.js' }),
})
