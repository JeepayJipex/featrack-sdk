import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV

export default defineConfig({
  entry: {
    index: 'lib/index.ts',
    js: 'lib/js/index.ts',
  },
  config: 'tsconfig.build.json',
  format: ['cjs', 'esm'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: true,
  minify: env === 'production',
  bundle: true,
  sourcemap: true,
  clean: true,
  loader: {
    '.tsx': 'tsx',
  },
})
