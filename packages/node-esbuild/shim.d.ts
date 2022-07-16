declare module '@size-limit/esbuild/convert-config' {
  import { BuildOptions } from 'esbuild'

  function convertConfig(esbuildConfig: BuildOptions, configPath: string): void

  export = convertConfig
}

declare module '@size-limit/esbuild/get-config' {
  import { BuildOptions } from 'esbuild'

  function getConfig(
    config: {
      configPath: string
      saveBundle: string
    },
    check: {
      esbuild?: false
      config?: string
      esbuildConfig: BuildOptions
      esbuildOutfile: string
      modifyEsbuildConfig?(esbuildConfig: BuildOptions): BuildOptions
    },
    esbuildOutfile: string,
  ): Promise<BuildOptions>

  export = getConfig
}
