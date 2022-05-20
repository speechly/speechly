import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

const esmBundle = {
  input: 'src/index.ts',

  output: {
    name: 'Speechly',
    format: 'esm', // ES Modules
    sourcemap: true,
    file: 'core/speechly.es.js',
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    webWorkerLoader( {
      "web-worker": /.+\.worker$/,
      pattern: /.+\.worker$/,
      extensions: ['.js', '.ts'],
      targetPlatform: 'browser',
    } ),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};

const umdMinBundle = {
  input: 'src/index.ts',

  output: {
    name: 'Speechly',
    format: 'umd',
    sourcemap: true,
    file: 'core/speechly.umd.min.js',
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    webWorkerLoader( {
      "web-worker": /.+\.worker$/,
      pattern: /.+\.worker$/,
      extensions: ['.js', '.ts'],
      targetPlatform: 'base64',
    } ),
    typescript({ tsconfig: './tsconfig.json' }),
    terser(),
  ],
};

export default [
  esmBundle,
  umdMinBundle,
]
