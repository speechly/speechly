# Browser UI

## Publishing to npm and CDN

```
# Update version number
code package.json

# Update CHANGELOG.md
code CHANGELOG.md

# Build release version
rushx build

# Push changes to git
git add .
git commit -m"v4"
git push

# Publish the package to npmjs. The UMD build from core should go to unpkg.com CDN:

npm publish
# Check Google Authenticator app for one-time password
```

## Architecture and considerations:

- Now `push-to-talk-button` is integrated with `browser-client`. Do we need some master component (like react-client's `SpeechProvider`) that holds/manages communication with `@speechly/browser-client`?

- Now component-to-component communication between `push-to-talk-button` and `big-transcript` is done with `postMessage` to achieve automagic binding. Also, `dispatchEvent` can be used so `addEventListener` can be used. Other candidates include: Callback binding w/property setter, `postMessage` (broadcast. No Safari support), `pubsub-js` (broadcast. Dependency needed)

- Should `PushToTalkButton.js` contain styles and svg images, or should they be defined externally? Can/should we use `<template>` for svgs? I did not immediately find a way to define templates in Wix.
