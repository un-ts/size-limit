import esbuildPlugin from '@size-limit/esbuild'

import type { SizeLimitEsbuildPlugin } from './types.js'

const base = (esbuildPlugin as readonly [SizeLimitEsbuildPlugin])[0]

const plugin: SizeLimitEsbuildPlugin = {
  ...base,
  name: 'size-limit-esbuild',

  async step20(config, check) {
    await base.step20?.(config, check)
    const esbuildConfig = check.esbuildConfig
    if (esbuildConfig) {
      if (!esbuildConfig.platform) {
        esbuildConfig.platform = 'node'
      }
      // Node libraries ship their dependencies, so only measure the package code
      if (!esbuildConfig.packages) {
        esbuildConfig.packages = 'external'
      }
    }
  },
}

export default [plugin] as const

export type {
  SizeLimitCheck,
  SizeLimitConfig,
  SizeLimitEsbuildPlugin,
} from './types.js'
