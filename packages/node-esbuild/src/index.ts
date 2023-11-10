/// <reference path="../shim.d.ts" />

import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { BuildOptions } from 'esbuild'
import { nanoid } from 'nanoid/non-secure'
import { SizeLimitCheck, SizeLimitConfig, processImport } from 'size-limit'

// https://github.com/ai/size-limit/blob/f2493379fefc00559af2a8c54fc52cedbbc9b0bd/packages/esbuild/get-config.js
async function getConfig(
  _config: SizeLimitConfig,
  check: SizeLimitCheck,
  output: string,
): Promise<BuildOptions> {
  await processImport(check, output)

  return {
    allowOverwrite: !!check.import,
    bundle: true,
    entryPoints: Array.isArray(check.files) ? check.files : [check.files],

    external: check.ignore,
    metafile: true,
    minifyIdentifiers: true,

    minifySyntax: true,
    minifyWhitespace: true,
    outdir: output,
    treeShaking: true,
    write: true,
  }
}

const setPlatformNode = (esbuildConfig: BuildOptions) => {
  // https://github.com/ai/size-limit/blob/f2493379fefc00559af2a8c54fc52cedbbc9b0bd/packages/esbuild/convert-config.js
  esbuildConfig.metafile = true
  if (!esbuildConfig.platform) {
    esbuildConfig.platform = 'node'
  }
  return esbuildConfig
}

export default [
  {
    name: 'size-limit-node-esbuild',

    async step20(config: SizeLimitConfig, check: SizeLimitCheck) {
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
        setPlatformNode(
          (check.esbuildConfig =
            'default' in esbuildConfig ? esbuildConfig.default : esbuildConfig),
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
