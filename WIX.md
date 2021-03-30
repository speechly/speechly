## Introduction

This documentation show how to use Speechly Web Toolkit components (from browser-ui repo) for voice-enabled web app development using Wix and Speechly.

Speechly Web Toolkit provides a special version of `<PushToTalkButton/>` custom element, that contains Speechly's browser-client JS connectivity library. This allows using Speechly on a web site without any build systems, using static resources served over-the-air static from a CDN.

You can get started with voice interfaces by following the instructions below. However, to get most out of your voice-enabled app, you can customize the voice configuration in Speechly Dashboard.

## Contents

- [Requirements](#requirements)
- [Usage](#usage)
- [PushToTalkButton component](#push-to-talk-button-component)
- [BigTranscript component](#bigtranscript-component)
- [Handling speech input](#handling-speech-input)

## Requirements

- You will need a Wix Premium plan for the site to use Speechly Web Toolkit as Custom Elements are only available for paid plans.
- Use Wix Publish function to review the changes to speech related code. In Wix Preview you'll get a broken Mic symbol (due to access restrictions to Web APIs in Preview mode.).

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
4. Right click it and "Pin settings" it to lower edge
5. Select "Choose Source", check "Server URL" and enter the following in box:

Server URL:
```
https://speechly.github.io/browser-ui/v1/push-to-talk-button.js
```

Tag Name:
```
push-to-talk-button
```

## BigTranscript component

`<BigTranscript/>` is an overlay-style component for displaying real-time speech-to-text transcript.

It is intended to be placed as an overlay near top-left corner of the screen with `<BigTranscriptContainer>`. It is momentarily displayed and automatically hidden after the end of voice input.

`<BigTranscript/>` communicates with `<PushToTalkButton/>` using `window.postMessage`, so it works just by placing the component in same DOM - no event binding required.

- Use Add > Embed > Custom Embeds > Custom Element
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

## Handling speech input

In HOME script (or preferably on masterPage.js to have the functionality)

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

See [docs.speechly.com](http://docs.speechly.com/) for tips on how to configure Speechly to handle complex speech input with speech intents and entities.
