# Change Log - @speechly/browser-client

This log was last generated on Thu, 11 Aug 2022 18:23:12 GMT and should not be manually modified.

## 2.4.2
Thu, 11 Aug 2022 18:23:12 GMT

### Patches

- Fixed honoring user-initiated startStream(). It should keep streaming audio to AudioProcessor to be able to send historyFrames upon start(). The stream was incorrectly paused upon call to stop(), which should only happen for automatically started streams when VAD is not in use.

## 2.4.1
Tue, 14 Jun 2022 13:51:56 GMT

### Patches

- Source sample rate was reset upon startStream causing Firefox and Safari to send 44kHz data instead of downsampling it to 16kHz."

## 2.4.0
Mon, 13 Jun 2022 08:05:47 GMT

### Minor changes

- Added AudioSourceState and onStateChange callback to BrowserMicrophone.

## 2.3.0
Tue, 07 Jun 2022 08:08:54 GMT

### Minor changes

- Word offsets are in relation to stream start. This is equal to time within audio context when not using VAD.

## 2.2.1
Thu, 02 Jun 2022 07:49:18 GMT

### Patches

- Fixed reconnecting after websocket close

## 2.2.0
Tue, 31 May 2022 10:24:53 GMT

### Minor changes

- BrowserClient.uploadAudioData() returns an array of Segments as the result. Upload throttling is used to ensure that the backend can keep up. BrowserClient.stopStream() now waits for last stopContext to arrive.

## 2.1.1
Mon, 30 May 2022 07:18:04 GMT

### Patches

- Fix error due to missing default argument in browser-client.

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

