# Speechly Web Components Beta for Wix

## Introduction

This document describes how to use Speechly Web Components on Wix sites to create voice-enabled web experiences like site navigation and site search.

Speechly provides real-time text-to-speech transcription and can be optionally configured to detect intents and tag keywords (entities).

## Contents

- [Requirements](#requirements)
- [Usage](#usage)
- [PushToTalkButton component](#push-to-talk-button-component)
- [BigTranscript component](#bigtranscript-component)
- [Example 1: Simple speech input to fill a text field](#example-1-simple-speech-input-to-fill-a-text-field)
- [Example 2: Simple voice site navigation](#example-2-simple-voice-site-navigation)
- [Example 3: Improved voice site navigation using intents](#example-3-improved-voice-site-navigation-using-intents)
## Requirements

- You need a free Speechly account from [Speechly Dashboard](https://api.speechly.com/dashboard)
- You need to enable Wix Velo development tools to be able to follow the instructions here.
- Wix Premium plan is required to use Custom elements on a Wix site.

#### Limitations

- Use Wix Publish function to review the changes to speech related code. In Wix Preview you'll get a broken Mic symbol (due to unavailability of required Web APIs in Preview mode).
- "Pin to screen" feature is not available on mobile. It's recommended to add a `placement` attribute with value `bottom` to enable placement override of the Push-to-talk button element to have it accessible on a mobile Wix site.

## Usage

- Navigate to your site in Wix Editor: https://editor.wix.com
- Turn on Dev Mode to see Velo code window
- Include the [PushToTalkButton component](#push-to-talk-button-component) and optionally a [BigTranscript component](#bigtranscript-component)
- Add a Speechly *app id* and include a script for handling speech input, e.g. [Example 1: Simple speech input to fill a text field](#example-1-simple-speech-input-to-fill-a-text-field)

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
https://speechly.github.io/browser-ui/latest/push-to-talk-button.js
# or
https://unpkg.com/@speechly/browser-ui/core/push-to-talk-button.js
```

Tag Name:
```
push-to-talk-button
```

Learn more about the attributes you can pass to `Push-to-talk button` component at [Speechly Web Components help](https://speechly.github.io/browser-ui/latest/).

## BigTranscript component

`<BigTranscript/>` is an overlay-style component for displaying real-time speech-to-text transcript.

It is intended to be placed as an overlay near top-left corner of the screen. The component is momentarily displayed when the user is talking and automatically hidden after the end of voice input. Please note that in Wix editor the contents of the component is empty.

`<BigTranscript/>` communicates with `<PushToTalkButton/>` using `window.postMessage`, so it works just by placing the component in same DOM - no event binding required.

- Use Add > Embed > Custom Embeds > Custom Element
- Resize the component to about 800 x 120px to make room for the transcript to appear.
- Right click it, select "Pin settings" and pin it to the top-left edge of the screen
- Select "Choose Source", check "Server URL" and enter the following in box:

Server URL:
```
https://speechly.github.io/browser-ui/latest/big-transcript.js
# or
https://unpkg.com/@speechly/browser-ui/core/big-transcript.js

```

Tag Name:
```
big-transcript
```

Learn more about the attributes you can pass to `Push-to-talk button` component at [Speechly Web Components help](https://speechly.github.io/browser-ui/latest/).

## Example 1: Simple speech input to fill a text field

The following example will all spoken words in a simple text box.

### Step 1/4: Create an *empty configuration* in Speechly Dashboard

- Go to [Speechly Dashboard](https://api.speechly.com/dashboard)
- Create an application with an *empty configuration*. This will use plain speech-to-text, which is good for this example.
- Make a note of the Speechly *app id* from the dashboard

### Step 2/4: Add a Input > Text Input field to your Wix page.

This example needs a text input field to put the spoken words into. In the example below we'll assume it's id is `#input1`.

### Step 3/4: Add the following lines in the Wix site's HOME page's script (or masterPage.js)

> Remember to replace the `MY_APP_ID_FROM_SPEECHLY_DASHBOARD` with the *app id* you created.

```js
$w.onReady(() => {
  $w('#pushtotalk').setAttribute('appid', 'MY_APP_ID_FROM_SPEECHLY_DASHBOARD')
  $w('#pushtotalk').on('speechsegment', (event) => onSpeechSegment(event.detail))
})

const onSpeechSegment = (segment) => {   
  // Show speech input in browser console
  console.log(segment)
  // Replace the text box content with the spoken words
  $w('#searchBox').value = segment.words.filter(w => w.value).map(w => w.value.toLowerCase()).join(" ")
}
```

### Step 4/4: Try it out

- Click *Publish* and view *View Site* to try voice in action.
- Tap or hold the button and say something like *"Show me blue jeans"*
- The text field should display the spoken words.

## Example 2: Simple voice site navigation

To implement simple site navigation with voice, we'll just react to words in the spoken transcript.

### Step 1/3: Create an *empty configuration* in Speechly Dashboard

> If you created a Speechy *app id* with an *empty configuration* earlier, you can skip this step and re-use that if you wish.

- Go to [Speechly Dashboard](https://api.speechly.com/dashboard)
- Create an application with an *empty configuration*. This will use plain speech-to-text, which is good for this example.
- Make a note of the Speechly *app id* from the dashboard

### Step 2/3: Add the following lines in the Wix site's HOME page's script (or masterPage.js)

```js
import wixLocation from 'wix-location'

$w.onReady(() => {
  $w('#pushtotalk').setAttribute('appid', 'MY_APP_ID_FROM_SPEECHLY_DASHBOARD')
  $w('#pushtotalk').on('speechsegment', (event) => onSpeechSegment(event.detail))
})

const onSpeechSegment = (segment) => {   
  // Show speech input in browser console
  console.log(segment)
  // Navigate to home page when "home" mentioned in the transcript.
  segment.words.forEach(word => {
    if (word.value.toLowerCase() === "home") wixLocation.to("/")
  })
}
```

### Step 3/3: Try it out

- Click *Publish* and view *View Site* to try voice in action.
- Tap or hold the button and say something like *"Go to the home page"*
- The page should reload

## Example 3: Improved voice site navigation using intents

To use best possible voice recognition accuracy it's recommended to customize the voice configuration in the Speechly dashboard to recognize phrases and keywords that are relevant to your use case.

### Step 1/3: Create an *empty configuration* in Speechly Dashboard

- Go to [Speechly Dashboard](https://api.speechly.com/dashboard)
- Start off with an *empty configuration* and edit it as shown below
- Be sure to make a note of the Speechly *app id* from the dashboard

```
*home Home
*home Home page
*home Navigate home
*home Go to {the} home page
*about About
*about {Tell me} about the site
```

### Step 2/3: Add the following lines in the Wix site's HOME page's script (or masterPage.js)

```js
import wixLocation from 'wix-location'

$w.onReady(() => {
  $w('#pushtotalk').setAttribute('appid', 'MY_APP_ID_FROM_SPEECHLY_DASHBOARD')
  $w('#pushtotalk').on('speechsegment', (event) => onSpeechSegment(event.detail))
})

const onSpeechSegment = (segment) => {   
  // Show speech input in browser console
  console.log(segment)
  // Navigate pages based on the intent of the utterance
  if (segment.intent.intent === "home") wixLocation.to("/")
  if (segment.intent.intent === "about") wixLocation.to("/about")
}
```

### Step 3/3: Try it out

- Click *Publish* and view *View Site* to try voice in action.
- Tap or hold the button and say something like *"Go to the home page"*
- The page should reload

## Learn more

See [docs.speechly.com](http://docs.speechly.com/) for description of the speech `segment` object and tips on how to configure Speechly to handle complex speech input with speech intents and entities.
