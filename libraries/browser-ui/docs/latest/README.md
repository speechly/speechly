# Browser UI

Speechly UI components provide the visual interface to support voice functionality. This package contains Speechly UI as Web Components that can be used in most browsers via CDN or npm.

See Web Component [documentation](https://docs.speechly.com/client-libraries/ui-components/) for details.

## Requirements

* [Node](https://nodejs.org/) (tested with v14.16.1)

### Built With

* [Typescript](https://www.typescriptlang.org/)
* [Svelte 3](https://svelte.dev/)
* [Speechly Browser Client](https://www.npmjs.com/package/@speechly/react-voice-forms/browser-client) that provides websocket connectivity and audio handling for Push-To-Talk Button component

## Developing

```
npm install
npm run dev
```

Then open http://localhost:5000

## Publishing to npm and CDN

```
# Update version number
code docs/dev/package.json

# Update CHANGELOG.md
code docs/dev/CHANGELOG.md

# Build release version
npm run build

# Automagically copy files from dev to 'v4' folder and 'latest' folder
./web-publish.sh v4

# Push changes to git, updating CDN version in GitHub pages:
git add .
git commit -m"v4"
git push

# Publish the package to npmjs
cd docs/latest
npm publish
# Check Google Authenticator app for one-time password
```

## Testing browser-ui locally in a test project

```
# In browser-ui, create a "linked package". Uses package.json in a subfolder to prevent unnecessary folder structure in the package
cd browser-ui/
pnpm run build
cd docs/dev
pnpm link 

# Using "linked package" in a project (intead of repo package/installing local)
cd react-ui
pnpm link browser-ui
```

## Creating a local browser-ui package

```
# Uses package.json in a subfolder to prevent unnecessary folder structure in the package.

pnpm pack docs/dev/
```

## Using browser-ui in React

```
import "browser-ui/push-to-talk-button";
import "browser-ui/big-transcript";
import "browser-ui/speechly-ui.css";

<div className="BigTranscriptContainer">
    <big-transcript></big-transcript>
</div>
<div className="PushToTalkContainer">
    <push-to-talk-button appid="1234"></push-to-talk-button>
</div>
```

- Notes: Copying .js from browser-ui directly resulted in compile errors in React project, so using packages solves this problem.

## Architecture and considerations:

- Now `push-to-talk-button` is integrated with `browser-client`. Do we need some master component (like react-client's `SpeechProvider`) that holds/manages communication with `@speechly/browser-client`?

- Now component-to-component communication between `push-to-talk-button` and `big-transcript` is done with `postMessage` to achieve automagic binding. Also, `dispatchEvent` can be used so `addEventListener` can be used. Other candidates include: Callback binding w/property setter, `postMessage` (broadcast. No Safari support), `pubsub-js` (broadcast. Dependency needed)

- Should `PushToTalkButton.js` contain styles and svg images, or should they be defined externally? Can/should we use `<template>` for svgs? I did not immediately find a way to define templates in Wix.
