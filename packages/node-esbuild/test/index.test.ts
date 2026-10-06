import { existsSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import nodeEsbuild from 'size-limit-node-esbuild'
import type { SizeLimitCheck, SizeLimitConfig } from 'size-limit-node-esbuild'

const [plugin] = nodeEsbuild

const createConfig = (saveBundle = ''): SizeLimitConfig => ({
  configPath: 'package.json',
  saveBundle,
})

const createCheck = (files: string[]): SizeLimitCheck =>
  ({ files }) as SizeLimitCheck

describe('size-limit-node-esbuild', () => {
  it('is recognised by size-limit as the esbuild plugin', () => {
    expect(plugin.name).toBe('size-limit-esbuild')
  })

  it('defaults the esbuild platform to node', async () => {
    const check = createCheck(['entry.js'])
    await plugin.step20?.(createConfig(), check)
    expect(check.esbuildConfig?.platform).toBe('node')
    expect(check.esbuildOutfile).toMatch(/size-limit-/)
  })

  it('externalises package imports', async () => {
    const check = createCheck(['entry.js'])
    await plugin.step20?.(createConfig(), check)
    expect(check.esbuildConfig?.packages).toBe('external')
  })

  it('keeps a platform chosen by modifyEsbuildConfig', async () => {
    const check = createCheck(['entry.js'])
    check.modifyEsbuildConfig = config => ({ ...config, platform: 'neutral' })
    await plugin.step20?.(createConfig(), check)
    expect(check.esbuildConfig?.platform).toBe('neutral')
  })

  it('does nothing when esbuild is disabled', async () => {
    const check = createCheck(['entry.js'])
    check.esbuild = false
    await plugin.step20?.(createConfig(), check)
    expect(check.esbuildConfig).toBeUndefined()
  })

  it('bundles the entry point with esbuild', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'size-limit-node-esbuild-'))
    try {
      const entry = path.join(dir, 'entry.js')
      await writeFile(entry, 'export const value = 1\n')
      const check = createCheck([entry])
      const config = createConfig()
      await plugin.step20?.(config, check)
      await plugin.step40?.(config, check)
      expect(check.bundles).toHaveLength(1)
      const [bundle] = check.bundles ?? []
      expect(bundle).toBeDefined()
      expect(existsSync(bundle)).toBe(true)
    } finally {
      await rm(dir, { force: true, recursive: true })
    }
  })
})
