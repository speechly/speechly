# Speechly Web Toolkit Beta for Wix

## Introduction

This document describes how to use Speechly Web Toolkit on Wix sites to create voice-enabled web experiences like site navigation and site search.

Speechly provides real-time text-to-speech transcription and can be optionally configured to detect intents and tag keywords (entities).

Speechly Web Toolkit bundles Speechly's browser-client JS connectivity library with `<PushToTalkButton/>` element so you can start using Speechly on a web site without any build systems, using static resources served over-the-air static from a CDN.

## Contents

- [Requirements](#requirements)
- [Usage](#usage)
- [PushToTalkButton component](#push-to-talk-button-component)
- [BigTranscript component](#bigtranscript-component)
- [Handling speech input](#handling-speech-input)

## Requirements

- You need to enable Wix Velo development tools to be able to follow the instructions here.
- You'll need a Wix Premium plan for the site as Custom Elements are only available for paid plans.

#### Limitations

- Use Wix Publish function to review the changes to speech related code. In Wix Preview you'll get a broken Mic symbol (due to unavailability of required Web APIs in Preview mode).
- Usability of components on mobile sites is limited. "Pin to screen" feature is not available so it will be hard to place the components so that they are readily accessible.

## Usage

- Navigate to your site in Wix Editor: https://editor.wix.com
- Turn on Dev Mode to see Velo code window
- Include the [PushToTalkButton component](#push-to-talk-button-component) and optionally a [BigTranscript component](#bigtranscript-component)
- Include a script for [Handling speech input](#handling-speech-input)

## Push-to-Talk Button component

`<PushToTalkButton/>` is a holdable button to control listening for voice input.

The Push-to-Talk button is intended to be placed as a floating button at the lower part of the screen using `<PushToTalkButtonContainer/>` so mobile users can reach it with ease.

1. Use Add > Embed > Custom Embeds > Custom Element
2. Select the new element
3. Set its ID to "#pushtotalk" in the lower panel
4. Resize the component to 96 x 96px to match the default size of "6rem".
5. Right click it and "Pin settings" it to lower edge
6. Select "Choose Source", check "Server URL" and enter the following in box:

Server URL:
```
https://speechly.github.io/browser-ui/v1/push-to-talk-button.js
```

Tag Name:
```
push-to-talk-button
```

See [Speechly Web Toolkit help](https://speechly.github.io/browser-ui/v1/) for the description of the component's API.

## BigTranscript component

`<BigTranscript/>` is an overlay-style component for displaying real-time speech-to-text transcript.

It is intended to be placed as an overlay near top-left corner of the screen with `<BigTranscriptContainer>`. It is momentarily displayed and automatically hidden after the end of voice input.

`<BigTranscript/>` communicates with `<PushToTalkButton/>` using `window.postMessage`, so it works just by placing the component in same DOM - no event binding required.

- Use Add > Embed > Custom Embeds > Custom Element
- Resize the component to about 800 x 120px to make room for the transcript to appear.
- Right click it, select "Pin settings" and pin it to the top-left edge of the screen
- Select "Choose Source", check "Server URL" and enter the following in box:

Server URL:
```
https://speechly.github.io/browser-ui/v1/big-transcript.js
```

Tag Name:
```
big-transcript
```

Please note that the contents of the component is empty by default.

See [Speechly Web Toolkit help](https://speechly.github.io/browser-ui/v1/) for the description of the component's API.

## Handling speech input

Add the following lines in the Wix site's HOME script (or masterPage.js):

```js
import wixLocation from 'wix-location';

$w.onReady(function () {
    $w('#pushtotalk').setAttribute('appid', '28ab6277-903e-44aa-905d-0f00d240063a');
    $w('#pushtotalk').on('segment-update', (event) => onSpeechSegment(event.detail))
});

const onSpeechSegment = (segment) => {   
    // Show speech input in browser console
    console.log(segment);
    // Navigate to home page when "home" mentioned in the transcript.
    segment.words.forEach(word => {
      if (word.value.toLowerCase() === "home") wixLocation.to("/");
    });
}
```

The above example uses a simple voice configuration that only provides a raw speech transcript.

See [docs.speechly.com](http://docs.speechly.com/) for description of the speech `segment` object and tips on how to configure Speechly to handle complex speech input with speech intents and entities.
