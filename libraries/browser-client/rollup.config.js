import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const typeScriptDefaults = {
  output: {
    format: 'esm', // ES Modules
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve()
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
