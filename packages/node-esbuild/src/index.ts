/// <reference path="../shim.d.ts" />

import { tmpdir } from 'node:os'
import { join } from 'node:path'

import convertConfig from '@size-limit/esbuild/convert-config'
import getConfig from '@size-limit/esbuild/get-config'
import type { BuildOptions } from 'esbuild'
import { nanoid } from 'nanoid/non-secure'

const setPlatformNode = (esbuildConfig: BuildOptions) => {
  if (!esbuildConfig.platform) {
    esbuildConfig.platform = 'node'
  }
  return esbuildConfig
}

export default [
  {
    name: 'size-limit-node-esbuild',

    async step20(
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
    ) {
      if (check.esbuild === false) {
        return
      }
      check.esbuildOutfile = config.saveBundle
      if (!check.esbuildOutfile) {
        check.esbuildOutfile = join(tmpdir(), `size-limit-${nanoid()}`)
      }
      if (check.config) {
        const esbuildConfig = (await import(check.config)) as
          | BuildOptions
          | { default: BuildOptions }
        convertConfig(
          setPlatformNode(
            (check.esbuildConfig =
              'default' in esbuildConfig
                ? esbuildConfig.default
                : esbuildConfig),
          ),
          config.configPath,
        )
      } else {
        check.esbuildConfig = setPlatformNode(
          await getConfig(config, check, check.esbuildOutfile),
        )
        if (check.modifyEsbuildConfig) {
          check.esbuildConfig = check.modifyEsbuildConfig(check.esbuildConfig)
        }
      }
    },
  },
] as const
