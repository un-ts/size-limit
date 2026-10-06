import type { BuildOptions, Metafile } from 'esbuild'
import type { Check } from 'size-limit'

export interface SizeLimitConfig {
  cleanDir?: boolean
  configPath: string
  saveBundle: string
}

export interface SizeLimitCheck extends Omit<Check, 'modifyEsbuildConfig'> {
  bundles?: string[]
  esbuild?: boolean
  esbuildConfig?: BuildOptions
  esbuildMetafile?: Metafile
  esbuildOutfile?: string
  files?: string[] | string
  size?: number
  modifyEsbuildConfig?(config: BuildOptions): BuildOptions
}

export interface SizeLimitEsbuildPlugin {
  name: string
  wait40?: string
  before?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
  finally?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
  step20?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
  step40?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
  step61?(config: SizeLimitConfig, check: SizeLimitCheck): Promise<void>
}
