declare module '@size-limit/esbuild' {
  import type { SizeLimitEsbuildPlugin } from './types.js'

  const plugins: readonly [SizeLimitEsbuildPlugin]

  export default plugins
}
