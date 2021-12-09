<div align="center" markdown="1">
<a href="https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header">
   <img src="https://d33wubrfki0l68.cloudfront.net/1e70457a60b0627de6ab966f1e0a40cf56f465f5/b4144/img/logo-speechly-colors.svg" height="48">
</a>

### Speechly is the Fast, Accurate, and Simple Voice Interface API for Web, Mobile and E‑commerce

[Website](https://www.speechly.com/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Docs](https://docs.speechly.com/)
&ensp;|&ensp;
[Discussions](https://github.com/speechly/speechly/discussions)
&ensp;|&ensp;
[Blog](https://www.speechly.com/blog/?utm_source=github&utm_medium=browser-client&utm_campaign=header)
&ensp;|&ensp;
[Podcast](https://anchor.fm/the-speechly-podcast)

---
</div>

# Speechly React UI components

![Release build](https://github.com/speechly/react-ui/workflows/Release%20build/badge.svg)
[![npm version](https://badge.fury.io/js/%40speechly%2Freact-ui.svg)](https://badge.fury.io/js/%40speechly%2Freact-ui)
[![License](http://img.shields.io/:license-mit-blue.svg)](LICENSE)

## Introduction

`@speechly/react-ui` package is an optional UI component library for speeding up voice-enabled web app development using React and Speechly.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [PushToTalkButton component](#push-to-talk-button-component)
- [BigTranscript component](#bigtranscript-component)
- [TranscriptDrawer component](#transcriptdrawer-component)
- [ErrorPanel component](#errorpanel-component)
- [Notifications](#notifications)

## Installation

Create a React app (if starting from scratch), then install the required packages:

```sh
# Create a new React app in current folder
create-react-app .

# Install react-ui and react-client dependency
npm i @speechly/react-client
npm i @speechly/react-ui
```

## Usage

Import the required components (e.g. in `App.jsx`):

```tsx
import {
  SpeechProvider
} from "@speechly/react-client";

import {
  PushToTalkButton,
  PushToTalkButtonContainer,
  BigTranscript,
  BigTranscriptContainer,
  ErrorPanel
} from "@speechly/react-ui";
```

Place the components inside your `<SpeechProvider>` block since they depend on the context hook it provides.

```tsx
function App() {
  return (
    <SpeechProvider appId="014ce3a6-9bbf-4605-976f-087a8f3ec178" language="en-US">
      <BigTranscriptContainer>
        <BigTranscript />
      </BigTranscriptContainer>

      <PushToTalkButtonContainer>
        <PushToTalkButton captureKey=" " />
        <ErrorPanel/>
      </PushToTalkButtonContainer>
    </SpeechProvider>
  );
}
```

To test it, run the app with `npm start`. If you used the default `appId` (Home Automation Demo), hold the push-to-talk button and try saying "Turn off the lights in the kitchen".

If you have already trained your own custom speech model, replace the `appId` with your own acquired from [Speechly Dashboard](https://speechly.com/dashboard).

### Further reading

- [Handling Speech Input in a React App in Speechly Blog](https://www.speechly.com/blog/handling-speech-input-in-a-react-app/)

## Push-to-Talk Button component

`<PushToTalkButton/>` is a holdable button to control listening for voice input.

The Push-to-Talk button is intended to be placed as a floating button at the lower part of the screen using `<PushToTalkButtonContainer/>` so mobile users can reach it with ease.

Desktop users can control it with an optional keyboard hotkey. Our hotkey recommendation is the spacebar.

The size and colors of the button can be customised. `<PushToTalkButtonContainer>` component is a convenience container that places the button at the lower part of the screen. You may replace it with your own `<div>` or similar.

### Properties

- [Component properties in TypeDocs](./docs/modules/components_PushToTalkButton.md)

### States

The icon on the button displays the Speechly system state:

1. **Offline** (Power-on icon): Pressing the button initialises the Speechly API and may trigger the browser's microphone permission prompt. Shown during `SpeechlyState.Idle`

2. **Ready** (Mic icon). Waiting for user to press and hold the button to start listening. Shown during `SpeechlyState.Ready`

3. **Listening** (Highlighted mic). This state is displayed when the component is being held down and Speechly listens for audio input. Shown during `SpeechlyState.Recording`

4. **Receiving transcript** (Pulsating mic). This state may be briefly displayed when the button is released and Speechly finalizes the stream of results. Shown during `SpeechlyState.Loading`

5. **Error** (Broken mic icon). In case of an error (usually during initialisation), the button turns into a broken mic symbol. If you have the optional `<ErrorPanel/>` component in your hierarchy, a description of the problem is displayed. Otherwise, you'll need to look into the browser console to discover the reason for the error. Shown in case of `SpeechlyState.Failed`, `SpeechlyState.NoAudioConsent`, `SpeechlyState.NoBrowserSupport`

## BigTranscript component

`<BigTranscript/>` is an overlay-style component for displaying real-time speech-to-text transcript.

It is intended to be placed as an overlay near top-left corner of the screen with `<BigTranscriptContainer>`. It is momentarily displayed and automatically hidden after the end of voice input.

### Properties

- [Component properties in TypeDocs](./docs/modules/components_BigTranscript.md)

### Example of displaying confimation checkmark with `speechhandled` message:

```tsx
  const { segment } = useSpeechContext();

  useEffect(() => {
    if (segment?.isFinal) {
      // Show confirmation if the app was able to process the segment
      window.postMessage({ type: "speechhandled", success: true }, "*")
    }
  }, [segment])
```

## TranscriptDrawer component

`<TranscriptDrawer/>` is an alternative to BigTranscript, displaying speech-to-text transcript and a hint text. This drawer-style component automatically appears from the top of the window when the app is listening for voice input (`SpeechState.Recording`) and hides automatically.

Set the `hint` property to show relevant hints for your audience at the time they are likely to need it.

  > 
  > Use `<TranscriptDrawer/>` to display both transcript *and* usage hints. Example phrases make hints: _Try "New arrivals"_. You could then anticipate the needs of the user with something like _Try "What brands do you have?"_ *or* _Try "I need t-shirts"_ ...
  > 

### Usage

Import the required components

```tsx
import {
  TranscriptDrawer,
} from "@speechly/react-ui/components/TranscriptDrawer";
```

Use the component instead of BigTranscript

```tsx
<SpeechProvider appId="014ce3a6-9bbf-4605-976f-087a8f3ec178">
  <TranscriptDrawer hint='Try "Show me new arrivals"'/>

  <PushToTalkButtonContainer>
    <PushToTalkButton captureKey=" " />
    <ErrorPanel/>
  </PushToTalkButtonContainer>
</SpeechProvider>
```

### Properties

- [Component properties in TypeDocs](./docs/modules/components_TranscriptDrawer.md)

## ErrorPanel component

`<ErrorPanel/>` is a normally hidden panel for voice-related error messages and recovery instructions when there is a problem with voice functions, e.g. when accessing site via http or if microphone permission is denied or unsupported in browser. Use it to help users diagnose and recover from voice-related issues.

`<ErrorPanel/>` is intended to be placed inside `<PushToTalkButtonContainer>` block. You may, however, place it anywhere in the component hierarchy.

It automatically shows if there is problem detected upon pressing the `<PushToTalkButton/>`. Internally, it uses `pubsub-js` for component to component communication.

## Notifications

Notifications are small messages that are intended to be momentarily displayed.

They are shown inside `<BigTranscriptContainer/>` at the top-left of the screen so it needs to be a part of your DOM.

Notifications can be cleared either programmatically or by tapping on them.

  >
  > Use Notifications to provide utterance examples and feedback, especially when the app is unable to respond to the user's utterance
  >

### Installation

`pubsub-js` package is used to communicate with the notification manager.

```
npm install --save pubsub-js
```

### Usage

Add the following lines to your header:

```
import PubSub from "pubsub-js";
import { SpeechlyUiEvents } from "@speechly/react-ui/types";
```

### Publishing a notification

```
PubSub.publish(SpeechlyUiEvents.Notification, {
  message: `Please say again`,
  footnote: `Try "Blue jeans"`
});
```

The notification consists of a short main message (displayed in big typeface) and an optional footnote (displayed in smaller typeface).

One notification can be displayed at a time. A successive call will instantly replace the previous notification.

### Clearing all notifications

```
PubSub.publish(SpeechlyUiEvents.DismissNotification);
````
