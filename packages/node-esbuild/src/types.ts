import type { BuildOptions, Metafile } from 'esbuild'
import type { Check } from 'size-limit'

export interface SizeLimitPluginConfig {
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

export interface SizeLimitPlugin {
  name: string
  wait40?: string
  before?(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
  finally?(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
  step20?(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
  step40?(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
  step60?(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
  step61?(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
}

export interface SizeLimitEsbuildPlugin extends SizeLimitPlugin {
  step20(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
  step40(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
  step61(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
}
