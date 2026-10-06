declare module '@size-limit/file' {
  const plugins: readonly [import('size-limit-node-esbuild').SizeLimitPlugin]

  export default plugins
}
