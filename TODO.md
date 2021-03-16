## Files served at

https://speechly.github.io/wix (Usage)
https://speechly.github.io/wix/push-to-talk-button.js

## Things to consider:

- Is (autonomous) `customComponent` the way to go for vanilla JS UI component support?
- Should plain vanilla JS components become the "master" version for all things browser to support vanilla JS/Wix/React/Vue...
- Do we need some master component (like react-client's `SpeechProvider`) that holds/manages communication with `@speechly/browser-client`?
- How should we arrange component-to-component communication between PushToTalkButton, browser-client, BigTranscript...? NOW: `dispatchEvent & CustomEvent`. Other candidates: Callback binding w/property setter, `postMessage` (broadcast. No Safari support), `pubsub-js` (broadcast. Dependency needed)
- Should these be developed as without any dev framework, of would some tool offer help in developing the customComponents? What would that be?
- How should the whole thing packed so that it can be used in from vanilla JS/Wix/React/Vue easily?
- Should `PushToTalkButton.js` contain styles and svg images, or should they be defined externally? Can/should we use `<template>` for svgs? I did not immediately find a way to define templates in Wix.

## Files

### PushToTalkButton.js 

Contains the definition of `talk-button` component and logic

## Changelog

- V5 handles connection to @speechly/browser-client, send update-segment CustomEvent
- V4 Deprecated `onholdstart` and `onholdend` attributes in favour of CustomEvents of similar names.
- V4 Tried using `<template>` for icon art, but removed it due to it making things difficult for Wix
- Moved "custom" customComponent method definitions like render() to constructor because Safari/iOS 12.5 did not work properly when they were defined as class methods
- Used autonomous variant of customComponent for Safari support. This way, our supported browser platforms should not change (not verified, though)

## TODO

- Icons for remaining app states
- Communication with @speechly/browser-client