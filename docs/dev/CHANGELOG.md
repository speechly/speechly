## 4.1.2

- Added two Custom Events to Push-To-Talk Button: startcontext (triggered on just before starting listening. Allows changing <code>appid</code> to redirect audio to an alternative voice configuration and stopcontext (triggered on just after stopping listening)

## 4.1.1

- Optional loginurl and apiurl attributes to connect to non-default Speechly endpoints.
## 4.1.0

- projectid attribute - Optional Speechly Project id to connect to. Allows changing App id on the fly within the same project.
- Tap-to-talk
- taptotalktime and silencetohanguptime attributes

## 4.0.3

- Broadcasts initialized message with new app id param
- ErrorPanel triggered upon Failed state; assumes that's due to invalid App Id.

## 4.0.2

- Fixed error-panel default placement and CSS

## 4.0.0

- Added error-panel component

## 2.0

- holdable-button component with no bundled browser-client; app id fix; reconnection fix; hold-to-talk prompt (using callout) and listening prompt, audio received and acknowledged indicators.
- 2021/03: Svelte can't use nested components from customElements. Nested components need to be also customComponents, and thus create their own shadow doms and styles. Seems unnecessarily heavy e.g. with every child node having own <style>, but not sure. Parent's style won't affect the child. Using flat hierarchly in big-transcript for now. As workaround, build script can be tweaked to compile customElements based on file name, but styling issues remained.
- 2021/03: Transitions on WebComponents not working https://github.com/sveltejs/svelte/issues/4735 > Using transFix.js to wrap transitions

## 1.0

- push-to-talk-button, big-transcript components

## 0.5

- Handles connection to @speechly/browser-client, send update-segment CustomEvent

## 0.4

- Deprecated `onholdstart` and `onholdend` attributes in favour of CustomEvents of similar names.
- Tried using `<template>` for icon art, but removed it due to it making things difficult for Wix
- Moved "custom" customElement method definitions like render() to constructor because Safari/iOS 12.5 did not work properly when they were defined as class methods
- Used autonomous variant of customElement for Safari support. This way, our supported browser platforms should not change (not verified, though)
