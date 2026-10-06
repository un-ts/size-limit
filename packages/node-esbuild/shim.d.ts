declare module '@size-limit/esbuild' {
  import type { SizeLimitEsbuildPlugin } from './src/types.js'

  const plugins: readonly [SizeLimitEsbuildPlugin]

  export default plugins
}
