import file from '@size-limit/file'
import nodeEsbuild, {
  type SizeLimitEsbuildPlugin,
} from 'size-limit-node-esbuild'

const preset: readonly SizeLimitEsbuildPlugin[] = [...nodeEsbuild, ...file]

export default preset
