declare module '@size-limit/file' {
  import type { SizeLimitPlugin } from 'size-limit-node-esbuild'

  const plugins: readonly [SizeLimitPlugin]

  export default plugins
}
