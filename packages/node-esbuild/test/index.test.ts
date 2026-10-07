import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import type { Plugin, PluginCheck, PluginConfig } from 'size-limit'
import { describe, expect, it } from 'vitest'

import nodeEsbuild from 'size-limit-node-esbuild'

type Step = (config: PluginConfig, check: PluginCheck) => Promise<void>

// The hooks this package implements are always there, so the tests can call them.
interface NodeEsbuildPlugin extends Plugin {
  step20: Step
  step40: Step
}

const [plugin] = nodeEsbuild as unknown as readonly [NodeEsbuildPlugin]

const createConfig = (saveBundle = ''): PluginConfig => ({
  checks: [],
  configPath: 'package.json',
  saveBundle,
})

const createCheck = (files: string[]): PluginCheck => ({ files })

describe('size-limit-node-esbuild', () => {
  it('is recognised by size-limit as the esbuild plugin', () => {
    expect(plugin.name).toBe('size-limit-esbuild')
  })

  it('defaults the esbuild platform to node', async () => {
    const check = createCheck(['entry.js'])
    await plugin.step20(createConfig(), check)
    expect(check.esbuildConfig?.platform).toBe('node')
    expect(check.esbuildOutfile).toMatch(/size-limit-/)
  })

  it('externalises package imports', async () => {
    const check = createCheck(['entry.js'])
    await plugin.step20(createConfig(), check)
    expect(check.esbuildConfig?.packages).toBe('external')
  })

  it('bundles relative imports but not package imports', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'size-limit-node-esbuild-'))
    try {
      const entry = path.join(dir, 'entry.js')
      await writeFile(
        entry,
        "import { value } from './dep.js'\nimport pad from 'lodash/pad'\nexport default value + pad\n",
      )
      await writeFile(path.join(dir, 'dep.js'), 'export const value = 42\n')
      const check = createCheck([entry])
      const config = createConfig()
      await plugin.step20(config, check)
      await plugin.step40(config, check)
      const [bundle] = check.bundles ?? []
      const js = await readFile(bundle, 'utf8')
      expect(js).toContain('42')
      expect(js).toContain('lodash/pad')
    } finally {
      await rm(dir, { force: true, recursive: true })
    }
  })

  it('externalises relative imports listed in ignore', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'size-limit-node-esbuild-'))
    try {
      const entry = path.join(dir, 'entry.js')
      await writeFile(
        entry,
        "import { value } from './dep.js'\nexport default value\n",
      )
      await writeFile(path.join(dir, 'dep.js'), 'export const value = 42\n')
      const check = createCheck([entry])
      check.ignore = ['lodash', './dep.js']
      const config = createConfig()
      await plugin.step20(config, check)
      await plugin.step40(config, check)
      expect(check.esbuildConfig?.external).toEqual(['lodash', './dep.js'])
      const [bundle] = check.bundles ?? []
      const js = await readFile(bundle, 'utf8')
      expect(js).not.toContain('42')
      expect(js).toContain('./dep.js')
    } finally {
      await rm(dir, { force: true, recursive: true })
    }
  })

  it('keeps a platform chosen by modifyEsbuildConfig', async () => {
    const check = createCheck(['entry.js'])
    check.modifyEsbuildConfig = <T extends object>(config?: T) =>
      ({ ...config, platform: 'neutral' }) as T
    await plugin.step20(createConfig(), check)
    expect(check.esbuildConfig?.platform).toBe('neutral')
  })

  it('does nothing when esbuild is disabled', async () => {
    const check = createCheck(['entry.js'])
    check.esbuild = false
    await plugin.step20(createConfig(), check)
    expect(check.esbuildConfig).toBeUndefined()
  })

  it('bundles the entry point with esbuild', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'size-limit-node-esbuild-'))
    try {
      const entry = path.join(dir, 'entry.js')
      await writeFile(entry, 'export const value = 1\n')
      const check = createCheck([entry])
      const config = createConfig()
      await plugin.step20(config, check)
      await plugin.step40(config, check)
      expect(check.bundles).toHaveLength(1)
      const [bundle] = check.bundles ?? []
      expect(bundle).toBeDefined()
      expect(existsSync(bundle)).toBe(true)
    } finally {
      await rm(dir, { force: true, recursive: true })
    }
  })
})
