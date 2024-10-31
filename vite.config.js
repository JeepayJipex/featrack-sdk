import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './lib/index.ts'),
      name: 'featrack-sdk',
      fileName: format => `index.${format}.js`,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dtsPlugin({ rollupTypes: true, include: './lib/**/*', tsconfigPath: 'tsconfig.build.json' })],
})
