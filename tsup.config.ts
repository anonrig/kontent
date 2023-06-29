import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  splitting: false,
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  minify: !options.watch,
  bundle: false,
  skipNodeModulesBundle: true,
  entry: ['lib/index.ts'],
  target: 'es2020',
  outDir: 'dist',
}))
