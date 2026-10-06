import type { SizeLimitPlugin } from '@size-limit/esbuild'
import file from '@size-limit/file'
import nodeEsbuild from 'size-limit-node-esbuild'

const preset: readonly SizeLimitPlugin[] = [...nodeEsbuild, ...file]

export default preset
