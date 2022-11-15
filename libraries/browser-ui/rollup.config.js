import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy-watch'

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

const webComponentDefaults = {
  input: null,
  output: {
    sourcemap: true,
    format: 'umd',
    name: 'SpeechlyUI',
    file: null,
  },
  plugins: [
    svelte({  // web components
      include: /\/[a-z][^/]+\.svelte$/,
      emitCss: false,
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        customElement: true,
        tag: null,
        // enable run-time checks when not in production
        dev: !production,
      }
    }),
    svelte({  // normal Svelte classes
      include: /\/[A-Z][^/]+\.svelte$/,
      emitCss: false,
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        customElement: false,
        tag: null,
        // enable run-time checks when not in production
        dev: !production,
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    // css({ output: 'push-to-talk-button.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `core` directory and refresh the
    // browser on changes when not in production
    !production && livereload('core'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  },
};

const typeScriptDefaults = {
  output: {
    format: 'esm', // ES Modules
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};

export default [
  {
    input: 'src/dummy.js',
    output: {
      file: 'temp/dummy.js'
    },
    plugins: [
      copy({
        watch: !production && [
          'src/assets/*'
        ],
        targets: [
          { src: 'src/assets/*', dest: 'core' },
        ]
      })
    ]
  },

  {...webComponentDefaults,
    input: 'src/holdable-button.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'core/holdable-button.js'
    },
  },

  {...webComponentDefaults,
    input: 'src/big-transcript.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'core/big-transcript.js'
    },
  },

  {...webComponentDefaults,
    input: 'src/push-to-talk-button.ts',
    output:
      {
        ...webComponentDefaults.output,
        file: 'core/push-to-talk-button.js'
      },
  },

  {...webComponentDefaults,
    input: 'src/transcript-drawer.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'core/transcript-drawer.js'
    },
  },

  {...webComponentDefaults,
    input: 'src/call-out.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'core/call-out.js'
    },
  },

  {...webComponentDefaults,
    input: 'src/video-guide.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'core/video-guide.js'
    },
  },

  {...webComponentDefaults,
    input: 'src/intro-popup.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'core/intro-popup.js'
    },
  },

  {...typeScriptDefaults,
    input: 'src/demomode.ts',
    output: [
      {
        ...typeScriptDefaults.output,
        file: 'core/demomode.js',
      },
    ],
  },

  {...typeScriptDefaults,
    input: 'src/index.ts',
    output: [
      {
        ...typeScriptDefaults.output,
        file: 'core/index.js',
      },
    ],
  },

]
