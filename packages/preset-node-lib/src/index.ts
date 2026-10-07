import file from '@size-limit/file'
import nodeEsbuild from 'size-limit-node-esbuild'

export default [...nodeEsbuild, ...file]
