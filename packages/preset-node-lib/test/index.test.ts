import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import type {
  SizeLimitCheck,
  SizeLimitPluginConfig,
  SizeLimitEsbuildPlugin,
} from '@size-limit/esbuild'
import { describe, expect, it } from 'vitest'

import preset from 'size-limit-preset-node-lib'

interface SizeLimitFilePlugin {
  name: string
  step60(config: SizeLimitPluginConfig, check: SizeLimitCheck): Promise<void>
}

const [nodeEsbuild, file] = preset as unknown as readonly [
  SizeLimitEsbuildPlugin,
  SizeLimitFilePlugin,
]

const createConfig = (): SizeLimitPluginConfig => ({
  configPath: 'package.json',
  saveBundle: '',
})

describe('size-limit-preset-node-lib', () => {
  it('combines the node esbuild plugin with the file plugin', () => {
    expect(preset.map(plugin => plugin.name)).toEqual([
      'size-limit-esbuild',
      '@size-limit/file',
    ])
  })

  it('measures the esbuild bundle of an entry point', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'size-limit-preset-'))
    try {
      const entry = path.join(dir, 'entry.js')
      await writeFile(entry, 'export const value = 1\n')
      const config = createConfig()
      const check = { files: [entry] } as SizeLimitCheck
      await nodeEsbuild.step20(config, check)
      await nodeEsbuild.step40(config, check)
      await file.step60(config, check)
      expect(check.bundles).toHaveLength(1)
      expect(check.size).toBeGreaterThan(0)
    } finally {
      await rm(dir, { force: true, recursive: true })
    }
  })
})
