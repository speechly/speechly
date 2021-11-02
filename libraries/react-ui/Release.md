# Speechly React UI

The sources are used to build Speechly React UI Components package.

## Install dependencies

```
npm install --save @speechly/react-client
npm install --save react-spring
npm install --save styled-components @types/styled-components
npm install --save pubsub-js @types/pubsub-js
npm link browser-ui
```

For `npm link browser-ui` to work, you need to create a source link from `browser-ui` as it's not yet available in npm:

```
git clone git@github.com:speechly/browser-ui.git
cd browser-ui/
pnpm run build
cd docs/dev
pnpm link 
```

## Using speechly components directly in a project

```
cd <~/git/react-ui>
export SPEECHLY_REACT_UI_PATH=`pwd`
cd <~/git/my/other/speechly/project>
$SPEECHLY_REACT_UI_PATH/link-react-ui.sh
```

This will create a link from `src/speechly` in the current project to Speechly react-ui's `components/src`.

## Scripts

### npm install

Installs dependencies

Fix for @types/styled-components react-native problem
described here: https://stackoverflow.com/questions/54706594/types-styled-components-duplicate-identifier-formdata

```
rm -rf "node_modules/@types/react-native"
rm -rf "node_modules/.pnpm/@types/react-native@0.63.34/"
```

### npm run build

Creates files for `npm pack` in `lib/`

### npm pack

Creates `react-ui-X.Y.Z.tgz` in the working dir. This can be tested before publishing like so:

```
cd npm-test
create-react-app .
npm install ../components/react-ui-*.tgz
```

## Publishing npm package

```
# Make sure you have `np` installed:
npm i -g np
# Push new release. Np wants to upgrade version by itself.
np
