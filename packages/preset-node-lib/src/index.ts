import file from '@size-limit/file'
import nodeEsbuild, { type SizeLimitPlugin } from 'size-limit-node-esbuild'

const preset: readonly SizeLimitPlugin[] = [...nodeEsbuild, ...file]

export default preset
