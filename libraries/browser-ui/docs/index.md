## Push-to-talk Button

Autonomous customElement for connecting to Speechly and controlling listening on/off.

<component-api id="push-to-talk-button-api">

### Attributes

- `appid` - Speechly App id to connect to.
- `projectid` - Optional Speechly Project id to connect to. Allows changing App id on the fly within the same project.
- `loginurl` - Optional alternative url to use for Speechly login.
- `apiurl` - Optional alternative url for Speechly API.
- `capturekey` - Optional string (of length 1). Defines a keyboard hotkey that with control listening on/off. Default: undefined. Recommendation: Space (" ")
- `poweron` - Optional string "auto"|"true"|"false". If "true", first button press sends a "poweron" message instead of initializing Speechly. This allows displaying a welcome screen using Intro Popup or a custom implementation. "auto" setting tries to detect presence of Intro Popup in DOM and use poweron if found. Default: "auto" 
- `hide` - Optional "false" | "true". Default: "false"

### Attributes for styling

- `placement` - Optional "bottom" turns on internal placement without <a href="https://unpkg.com/@speechly/browser-ui/core/speechly-ui.css">PushToTalkContainer</a> CSS class
- `size` - Optional string (CSS). Defines the button frame width and height. Default: "88px"
- `voffset` - Optional CSS string. Vertical distance from viewport edge. Only effective when using placement.
- `backgroundcolor` - Optional string (CSS color) for button background. Default: "#ffffff".
- `iconcolor` - Optional string (CSS color) for button icon. Default: "#000000".
- `gradientstop1` - Optional string (CSS color) for border color. Default: "#15e8b5".
- `gradientstop2` - Optional string (CSS color) for border color. Default: "#4fa1f9"
- `fxgradientstop1` - Optional string (CSS color). Default: gradientstop1
- `fxgradientstop2` - Optional string (CSS color). Default: gradientstop2
- `customtypography` - Optional "true" | "false". True inherits css typography settings. Default: "false"
- `customcssurl` - Optional string (url to .css file). Allows for further customization of component's shadow root.

### Attributes for tap and hold behaviour

- `taptotalktime` - Optional time in milliseconds to listen after tap. Set to 0 to disable tap-to-talk. Default: "8000" (ms)
- `silencetohanguptime` - Optional milliseconds of silence to listen before hangup. Only used in tap-to-talk mode. Default: "1000" (ms)
- `holdscale` - Optional scale for button size when held down. Relative to `size`. Default: "1.35".
- `borderscale` - Optional scale for button size when held down. Relative to button radius. Default: "0.06".
- `iconsize` - Optional string (CSS dimension) for icon size. Relative to `size`. Default: "60%".
- `fxsize` - Optional string (CSS dimension) for button hold fx size. Relative to `size`. Default: "250%".

### Attributes for usage hints

- `intro` - Optional string containing a short usage introduction. Displayed when the component is first displayed. Default: "Push to talk". Set to "" to disable.
- `hint` - Optional string containing a short usage hint. Displayed on a short tap. Default: "Push to talk". Set to "" to disable.
- `showtime` - Optional time in milliseconds. Visibility duration for intro and hint callouts. Default: "5000" (ms)
- `fontsize` - Optional CSS string for hint text. Default: "1.2rem"
- `textcolor` - Optional string (CSS color) for hint text. Default: "#ffffff"
- `hintbackgroundcolor` - Optional string (CSS color) for hint text background. Default: "#202020" (attribute name changed from `backgroundcolor`)
- `hintxalign` - Optional string (CSS percentage). Default: "50%"
- `hintwidth` - Optional string (CSS dimension). Default: "auto"

### Events emitted

- `holdstart` - CustomEvent triggered upon hold start
- `holdend` - CustomEvent triggered upon hold end. event.detail.timeMs contains hold time in ms.
- `speechsegment` - CustomEvent triggered when speech-to-text segment changes. Segment available as the event.detail property.
- `starting` - CustomEvent triggered on initialization start
- `initialized` - CustomEvent triggered on initialization end. event.detail: {success: true | false, appId: string, state: ClientState.Connected|Failed|NoBrowserSupport|NoAudioConsent}
- `startcontext` - CustomEvent triggered on just before starting listening. Allows changing `appid` to redirect audio to an alternative voice configuration.
- `stopcontext` - CustomEvent triggered on just after stopping listening.

### Window messages sent (postMessage)

- `{type: "speechsegment", segment: Segment}` - Broadcasts new segment when an update is available
- `{type: "speechstate", state: ClientState}` - Broadcasts state changes. Refer to browser-client documentation for values.
- `{type: "holdstart"}` - Broadcasted upon hold start
- `{type: "holdend"}` - Broadcasted upon hold end
- `{type: "poweron"}` - Broadcasted on button initial button press when poweron="true"

### Window messages listened

- `{type: "showhint", hint: string}` - Shows a custom hint using the call-out on the button.

</component-api>

## Big Transcript

`<big-transcript/>` is an overlay-style component for displaying real-time speech-to-text transcript.

It is intended to be placed as an overlay near top-left corner of the screen using `BigTranscriptContainer` CSS class. It is momentarily displayed and automatically hidden after the end of voice input.

<component-api id="big-transcript-api">

### Attributes

- `placement` - Optional "top" turns on internal placement without <a href="https://unpkg.com/@speechly/browser-ui/core/speechly-ui.css">BigTranscriptContainer</a> CSS class
- `hoffset` - Optional CSS string. Horizontal distance from viewport edge. Only effective when using placement.
- `voffset` - Optional CSS string. Vertical distance from viewport edge. Only effective when using placement.
- `fontsize` - Optional CSS string for text size. Default: "1.5rem"
- `color` - Optional string (CSS color) for text. Default: "#ffffff"
- `highlightcolor` - Optional string (CSS color) for entity highlighting, vu meter and acknowledged icon. Default: "#15e8b5"
- `backgroundcolor` - Optional string (CSS color) for hint text background. "none" for no background. Default: "#202020"
- `marginbottom` - Optional string (CSS dimension). Dynamic margin added when element is visible. Default: "0rem"
- `formattext` - Optional "true" | "false". If true, transcript is formatted with detected entities, e.g. numbers. Default: "true"
- `demomode` - Optional "true" | "false". If true, transitions are slowed down for better readablility. Default: "false"
- `customtypography` - Optional "true" | "false". True inherits css typography settings. Default: "false"
- `customcssurl` - Optional string (url to .css file). Allows for further customization of component's shadow root.


### Properties

- `speechsegment(segment: Segment)` - Function. Call whenever a new segment update is available
- `speechstate(state: ClientState)` - Function. Call whenever ClientState changes. Needed to show/hide element.
- `speechhandled(success: boolean)` - Function. Optionally call on segment.isFinal to show confirmation that speech was processed. An indication will be shown with big-transcript.

### Events emitted

- `visibilitychanged` - Called when visibility changes

### Window messages listened

- `{type: "speechstate", state: ClientState}` - Required. Needed to show/hide element. This message is automatically emitted by push-to-talk-button.
- `{type: "speechsegment", segment: Segment}` - Required. Updates transcript content in component. This message is automatically emitted by push-to-talk-button.
- `{type: "speechhandled", success: boolean}` - Optional. Shows an indication to the user that the voice command was successfully understood by the app. Use window.postMessage to send it on segment.isFinal.
</component-api>

## Holdable Button

Autonomous customElement that displays a stateless, holdable button with an icon and emits events on press.


### Installation

<xmp><head>
<script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/holdable-button.js"></script>
</head>
</xmp>

<component-api id="holdable-button-api">

### Attributes

- `icon` - Defines the appearance and behaviour of the button. Accepts serialized enums of ClientState (from browser-client).
- `capturekey` - Optional string (of length 1). Defines a keyboard hotkey that with control listening on/off. Default: undefined. Recommendation: Space (" ")
- `size` - Optional string (CSS). Defines the button frame width and height. Default: "6rem"
- `gradientstop1` - Optional string (CSS color). Default: "#15e8b5"
- `gradientstop2` - Optional string (CSS color). Default: "#4fa1f9"
- `fxgradientstop1` - Optional string (CSS color). Default: gradientstop1
- `fxgradientstop2` - Optional string (CSS color). Default: gradientstop2

### Properties

- `onholdstart` - Callback function slot for hold start.
- `onholdend` - Callback function slot for hold end. Params: timeMs (number) contains hold time in ms.
- `isbuttonpressed()` - Returns true if button is currently held pressed.

### Events emitted

- `holdstart` - CustomEvent triggered upon hold start
- `holdend` - CustomEvent triggered upon hold end. event.detail.timeMs contains hold time in ms.
</component-api>

## Transcript Drawer

Transcript Drawer is an drawer-style component for displaying real-time speech-to-text transcript and hint texts.

It's an alternative to big-transcript (actually a wrapper). It is displayed at the top of the screen. It is momentarily displayed and automatically hidden after the end of voice input.


### Usage

<p>
  Include the following lines in your `<body>`:
</p>
<xmp><transcript-drawer></transcript-drawer>
</xmp>

<component-api id="transcript-drawer-api">

### Attributes

- `hint` - Hint text to be shown when the app is listening for speech. Hint is hidden upon user speech is received. String or a JSON.stringify'ed string array, e.g. `hint='["Try: 1st hint", "Try: 2nd hint"]'`. Pay attention to use double quotes in JSON. If an array is provided, the next tip is automatically shown after an utterance. After all tips are shown, they will be shown again in random order. Default: ""
- `height` - Optional minimum height as CSS string. Default: "8rem"
- `color` - Optional string (CSS color) for text. Default: "#ffffff"
- `smalltextcolor` - Optional string (CSS color) for hint text. Default: "#ffffff70"
- `highlightcolor` - Optional string (CSS color) for entity highlighting, vu meter and acknowledged icon. Default: "#15e8b5"
- `backgroundcolor` - Optional string (CSS color) for hint text background. Default: "#202020"
- `fontsize` - Optional CSS string for text size. Default: "1.5rem"
- `hintfontsize` - Optional CSS string for hint text size. Default: "0.9rem"
- `formattext` - Optional "true" | "false". If true, transcript is formatted with detected entities, e.g. numbers. Default: "true"
- `demomode` - Optional "true" | "false". If true, transitions are slowed down for better readablility. Default: "false"
- `customtypography` - Optional "true" | "false". True inherits css typography settings. Default: "false"
- `customcssurl` - Optional string (url to .css file). Allows for further customization of component's shadow root.


### Properties

- `speechsegment(segment: Segment)` - Function. Call whenever a new segment update is available
- `speechstate(state: ClientState)` - Function. Call whenever ClientState changes. Needed to show/hide element.
- `speechhandled(success: boolean)` - Function. Optionally call on segment.isFinal to show confirmation that speech was processed. An indication will be shown with big-transcript.
- `sethint(message: string)` - Optionally update hint text.


### Window messages listened

- `{type: "speechsegment", segment: Segment}` - Expects an update whenever a new segment update is available. This is usually sent by push-to-talk-button
- `{type: "speechstate", state: ClientState}` - Needed to show/hide element
- `{type: "speechhandled", success: boolean}` - Optionally send a confirmation on segment.isFinal that speech was processed. An indication will be shown with big-transcript.
- `{type: "hint", hint: text}` - Optionally update hint text.
</component-api>

## Intro Popup

Intro Popup is a full screen overlay-style popup that is displayed when the user first interacts with Push-To-Talk Button. It displays a customizable introduction text that briefly explains voice features microphone permissions are needed for.

The user will have a choice between allowing the microphone permissions or do that later. Allowing will display the system permission prompt.

Intro Popup also automatically appears to help recover from a common problems.

### Installation

<xmp><head>
<script type="text/javascript" src="https://unpkg.com/@speechly/browser-ui/core/intro-popup.js"></script>
</head>
</xmp>

### Usage

Include the following lines in your `<body>`:

<xmp><intro-popup>
<span slot="priming-body">You will be able to book faster with voice.</span>
</intro-popup>
</xmp>

<component-api id="intro-popup">


### Attributes

- `hide` - Optional "auto" | "false" | "true". Auto setting displays the popup upon mic button interaction or in case a problem is detected. False and true allow manual visibility control. Default: "auto"
- `remsize` - Optional rem override. "16px" recommended for Wix. Default: "1rem"
- `customtypography` - Optional "true" | "false". True inherits css typography settings. Default: "false"
- `customcssurl` - Optional string (url to .css file). Allows for further customization of component's shadow root.

### Child nodes

- The title can be customized with `<span slot="priming-title">Allow booking with voice</span>`
- The body text can be customized with `<span slot="priming-body">You will be able to book faster with voice.</span>`

### Events emitted

- `speechlyintroclosed` - CustomEvent emitted on closed by user

### Window messages emitted (postMessage)

- `{type: "speechlyintroready"}` - Broadcasted upon mount
- `{type: "speechlyintroclosed", firstrun: undefined|true}` - Broadcasted when popup is closed by user

### Window messages listened

- `{type: "speechlypoweron"}` - Displays the intro popup's welcome screen. This message is automatically emitted by push-to-talk-button when poweron="true"|"auto".
- `{type: "speechstate", state: ClientState}` - Displays the intro popup's connecting and error screens. This message is automatically emitted by push-to-talk-button.

</component-api>

## Video Guide

Overlay voice usage video.

Include the following lines in your `<body>`:

<xmp><video-guide>
video="https://mysite.com/usage.mp4">
</video-guide>
</xmp>

<component-api id="video-guide">

### Attributes

- `video` - Url for intro video in mp4 format. 640x400px 10fps recommended.
- `hide` - Optional "false" | "true". Default: "true"
- `remsize` - Optional rem override. "16px" recommended for Wix. Default: "1rem"
</component-api>


## Demomode

Demomode utility can display instructions for the end user. It sends `segmentupdate` messages (postMessage) in a sequence and drives Big Transcript or Transcript Drawer components.
Additionally, if your application is set up to listen to these messages, it will react to those as if they were input from a real user. You may need to reset your altered app state after exiting the demo mode.


### Usage

Include the following lines in your `<body>`:

<xmp><script type="module">
import {startDemo, stopDemo} from './demomode.js'

let demoStrings = [
  "*book book a flight from london(from) to [new york](to)",
  "*book in [business class](class)",
];

const transcriptEl = document.getElementsByTagName("transcript-drawer")[0];

document.querySelector('#start-demo').addEventListener('click', ()=>{
startDemo(demoStrings)
transcriptEl.setAttribute("demomode", "true");
});
document.querySelector('#stop-demo').addEventListener('click', ()=>{
stopDemo()
transcriptEl.setAttribute("demomode", "false");
});
</script>

</xmp>

<component-api id="demo-mode">

### Methods

- `startDemo(utterances[])` - Starts the demo mode. Utterances is an array of strings in simplified SAL format. Each utterance must start with an `*intent`, followed by any number of transcript words and entities coded like this: `[entity_value](entity_type)`.
- `stopDemo()` - Stops the demo mode.
</component-api>
