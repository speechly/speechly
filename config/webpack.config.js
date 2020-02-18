const path = require('path');

// TODO: peer dependencies

let mode, devtool;

switch (process.env.WEBPACK_MODE) {
  case 'prd':
    mode = 'production';
    devtool = 'source-map';
    break;
  case 'dev':
    mode = 'development';
    devtool = 'inline-source-map';
    break;
  default:
    console.error('Unknown webpack mode', process.env.WEBPACK_MODE);
    process.exit(-1);
}

const config = {
  devtool,
  mode,
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          /.test.ts/,
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'speechly.js',
    library: 'speechly',
    libraryTarget: 'umd',
  },
}

console.log('Starting with config', config);

module.exports = config;
