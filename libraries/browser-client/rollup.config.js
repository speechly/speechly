import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const typeScriptDefaults = {
  output: {
    format: 'esm', // ES Modules
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
  ],
};

export default [
  {...typeScriptDefaults,
    input: 'src/index.ts',
    output: [
      {
        ...typeScriptDefaults.output,
        file: 'dist/index.js',
      },
    ],
  },
]
