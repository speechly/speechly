// This script is a modification of the original prepDist.js, courtesy of Apollo GraphQL.
// Copied from https://github.com/apollographql/apollo-client/blob/dda7952ca66b403bf76d9407b949e9f698f6bef8/config/prepareDist.js
//
// The Speechly client source that is published to npm is located in the
// "dist" directory. This utility script is called when building Speechly client,
// to make sure the "dist" directory is prepared for publishing.
//
// This script will:
//
// - Delete unnecessary type definition files, which are rolled up by api-extractor.
// - Copy the current root package.json into "dist" after adjusting it for
//   publishing.
// - Copy the supporting files from the root into "dist" (e.g. `README.MD`,
//   `LICENSE`, etc.).

const fs = require('fs')
const packageJson = require('./package.json')

const srcDir = `${__dirname}`
const destDir = `${srcDir}/lib`

// The root package.json is marked as private to prevent publishing
// from happening in the root of the project. This sets the package back to
// public so it can be published from the "dist" directory.
packageJson.private = false

// Remove package.json items that we don't need to publish
delete packageJson.scripts
delete packageJson.bundlesize
delete packageJson.files

// The root package.json points to the CJS/ESM source in "dist", to support
// on-going package development (e.g. running tests, supporting npm link, etc.).
// When publishing from "dist" however, we need to update the package.json
// to point to the files within the same directory.
const distPackageJson =
  JSON.stringify(
    packageJson,
    (_key, value) => {
      if (typeof value === 'string' && value.startsWith('./lib/')) {
        const parts = value.split('/')
        parts.splice(1, 1) // remove dist
        return parts.join('/')
      }
      return value
    },
    2,
  ) + '\n'

// Save the modified package.json to "dist"
fs.writeFileSync(`${destDir}/package.json`, distPackageJson)

// Copy supporting files into "dist"
fs.copyFileSync(`${srcDir}/README.md`, `${destDir}/README.md`)
fs.copyFileSync(`${srcDir}/LICENSE`, `${destDir}/LICENSE`)
