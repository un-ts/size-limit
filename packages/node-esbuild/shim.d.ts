declare module '@size-limit/esbuild' {
  const plugins: readonly [import('./src/types.js').SizeLimitEsbuildPlugin]

  export default plugins
}
