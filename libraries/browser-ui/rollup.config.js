import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

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
    format: 'iife',
    name: 'app',
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
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      sourceMap: true,
    }),
    
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),
    
    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),
    
    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  },
};

const typeScriptDefaults = {
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};

export default [
  {...webComponentDefaults, 
    input: 'src/holdable-button.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'lib/holdable-button.js'
    },
  },
  
  {...webComponentDefaults, 
    input: 'src/big-transcript.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'lib/big-transcript.js'
    },
  },
  
  {...webComponentDefaults, 
    input: 'src/push-to-talk-button.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'lib/push-to-talk-button.js'
    },
  },

  {...webComponentDefaults, 
    input: 'src/transcript-drawer.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'lib/transcript-drawer.js'
    },
  },

  {...webComponentDefaults, 
    input: 'src/call-out.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'lib/call-out.js'
    },
  },

  {...webComponentDefaults, 
    input: 'src/error-panel.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'lib/error-panel.js'
    },
  },

  {...webComponentDefaults, 
    input: 'src/intro-popup.ts',
    output: {
      ...webComponentDefaults.output,
      file: 'lib/intro-popup.js'
    },
  },

  {...typeScriptDefaults,
    input: 'src/demomode.ts',
    output: [
      {
        file: 'lib/demomode.js',
        format: 'esm', // ES Modules
        sourcemap: true,
      },
    ],
  },
  
]
