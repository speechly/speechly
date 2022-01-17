import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const esmBundle = {
  input: 'src/index.ts',

  output: {
    name: 'Speechly',
    format: 'esm', // ES Modules
    sourcemap: true,
    file: 'dist/speechly.es.js',
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};

const umdBundle = {
  input: 'src/index.ts',

  output: {
    name: 'Speechly',
    format: 'umd',
    sourcemap: true,
    file: 'dist/speechly.umd.js',
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};

export default [
  esmBundle,
  umdBundle,
]
