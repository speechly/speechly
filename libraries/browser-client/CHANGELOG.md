# Change Log - @speechly/browser-client

This log was last generated on Wed, 25 May 2022 05:10:21 GMT and should not be manually modified.

## 2.1.0
Wed, 25 May 2022 05:10:21 GMT

### Minor changes

- Optional EnergyThreshold VAD to trigger SLU activation based on signal level."

## 2.0.1
Wed, 11 May 2022 10:44:31 GMT

### Patches

- Do not throw error if stopping a stopped context

## 2.0.0
Wed, 04 May 2022 12:48:48 GMT

### Breaking changes

- Rename SpeechlyClient to BrowserClient, add support for external MediaStreams and AudioBuffers

## 1.5.0
Tue, 29 Mar 2022 11:27:59 GMT

### Minor changes

- Add sendAudioData function for uploading an audio file to be transcribed.

## 1.4.0
Mon, 28 Feb 2022 08:02:56 GMT

### Minor changes

- startContext and stopContext can be called regardless of ClientState, and they will bring the client to ClientState.Recording and ClientState.Connected unless there was an unrecoverable error (ClientState.Failed). More graceful websocket close handling."

## 1.3.0
Thu, 10 Feb 2022 14:03:08 GMT

### Minor changes

- Exposed 'connect()' method for manual connect. The constructor can be passed 'connect: false' to skip auto-connect. 'startContext()' calls 'initialize()' calls 'connect()' if not done so earlier manually.
- Deprecated language ClientOptions parameter. Language is a property of the appId so the backend knows it."

### Patches

- Client.ts to govern reconnecting - using exponential reconnect delay.

## 1.2.0
Fri, 28 Jan 2022 11:38:16 GMT

### Minor changes

- New browser-client package with two JS module bundles (ES & UMD) instead of CJS.

### Patches

- Add sources to target build

