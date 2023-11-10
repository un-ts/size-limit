declare module 'size-limit' {
  import { BuildOptions } from 'esbuild'

  export interface SizeLimitConfig {
    configPath: string
    saveBundle: string
  }

  export interface SizeLimitCheck {
    import?: string
    files: string[] | string
    ignore?: string[]
    esbuild?: false
    config?: string
    esbuildConfig: BuildOptions
    esbuildOutfile: string
    modifyEsbuildConfig?(esbuildConfig: BuildOptions): BuildOptions
  }

  export const processImport: (
    check: SizeLimitCheck,
    output: string,
  ) => Promise<void>
}
