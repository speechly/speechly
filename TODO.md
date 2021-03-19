## Things to consider:

"For Web platforms (Web sites, Wix), Speechly's quickest-to-adopt solution is to drop the `<push-to-talk-button/>` customElement from our CDN to your web site or app and start implementing responses to voice commands."

Spot 10 things that could be improved

Maintainability:
- Should plain vanilla JS components become the "master" version for all things browser to support vanilla JS/Wix/React/Vue/Svelte..

Packaging:
- Is (autonomous) `customElement` the way to go for vanilla JS UI component support? Other alternatives?
- Can it handle vanilla JS/Wix/React/Vue...?
- Should we serve the components on GitHub Pages or other CDN?
- Which repo(s)? "wix", "browser-ui", "vue-ui"... VS "browser-ui" for all VS "browser-client"?

Tools:
- Should these be developed as without any dev framework, of would some tool offer help in developing the customElements? What would that be? Svelte?

Architecture:
- Do we need some master component (like react-client's `SpeechProvider`) that holds/manages communication with `@speechly/browser-client`? VS integrated `push-to-talk-button`
- How should we arrange component-to-component communication between PushToTalkButton, browser-client, BigTranscript...? NOW: `dispatchEvent & CustomEvent`. Other candidates: Callback binding w/property setter, `postMessage` (broadcast. No Safari support), `pubsub-js` (broadcast. Dependency needed)
- Should `PushToTalkButton.js` contain styles and svg images, or should they be defined externally? Can/should we use `<template>` for svgs? I did not immediately find a way to define templates in Wix.


## Files

### PushToTalkButton.js 

Contains the definition of `talk-button` component and logic

## Changelog

- 2021/03: Svelte can't use nested components from customElements. Nested components need to be also customComponents, and thus create their own shadow doms and styles. Seems unnecessarily heavy e.g. with every child node having own <style>, but not sure. Parent's style won't affect the child. Using flat hierarchly in big-transcript for now. As workaround, build script can be tweaked to compile customElements based on file name, but styling issues remained.
- 2021/03: Transitions on WebComponents not working https://github.com/sveltejs/svelte/issues/4735 > Using transFix.js to wrap transitions

- V5 handles connection to @speechly/browser-client, send update-segment CustomEvent
- V4 Deprecated `onholdstart` and `onholdend` attributes in favour of CustomEvents of similar names.
- V4 Tried using `<template>` for icon art, but removed it due to it making things difficult for Wix
- Moved "custom" customElement method definitions like render() to constructor because Safari/iOS 12.5 did not work properly when they were defined as class methods
- Used autonomous variant of customElement for Safari support. This way, our supported browser platforms should not change (not verified, though)

## TODO

- Icons for remaining app states
- Communication with @speechly/browser-client