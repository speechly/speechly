import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
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
    babel({
      plugins: ['@babel/plugin-proposal-class-properties'],
      presets: ['@babel/preset-flow'],
    }),
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
