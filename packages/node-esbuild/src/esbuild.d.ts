declare module '@size-limit/esbuild' {
  import type { BuildOptions, Metafile } from 'esbuild'
  import type { Check } from 'size-limit'

  interface SizeLimitConfig {
    cleanDir?: boolean
    configPath: string
    saveBundle: string
  }

  interface SizeLimitCheck extends Omit<Check, 'modifyEsbuildConfig'> {
    bundles?: string[]
    esbuild?: boolean
    esbuildConfig?: BuildOptions
    esbuildMetafile?: Metafile
    esbuildOutfile?: string
    files?: string[] | string
    size?: number
    modifyEsbuildConfig?(config: BuildOptions): BuildOptions
  }

  interface SizeLimitEsbuildPlugin {
    name: string
    wait40?: string
    before?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
    finally?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
    step20?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
    step40?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
    step61?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
  }

  const plugins: readonly [SizeLimitEsbuildPlugin]

  export default plugins
}
