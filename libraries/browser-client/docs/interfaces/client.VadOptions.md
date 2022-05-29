[@speechly/browser-client](../README.md) / [client](../modules/client.md) / VadOptions

# Interface: VadOptions

[client](../modules/client.md).VadOptions

Options for audio processor's voice activity detector (VAD).
Enabling VAD automatically starts and stops cloud speech decoding. This enables for hands-free use and eliminates silence from being sent to cloud for processing.

VAD activates when signal energy exceeds both the absolute energy threshold ([noiseGateDb](client.VadOptions.md#noisegatedb)) and the dynamic signal-to-noise threshold ([signalToNoiseDb](client.VadOptions.md#signaltonoisedb)) for a period defined of time ([signalActivation](client.VadOptions.md#signalactivation)).

When [enabled](client.VadOptions.md#enabled) is set, VAD's internal `signalDb`, `noiseLevelDb` and `isSignalDetected` states are updated.
With [controlListening](client.VadOptions.md#controllistening) also set, `isSignalDetected` flag controls start and stop of cloud speech decoding.

## Table of contents

### Properties

- [enabled](client.VadOptions.md#enabled)
- [controlListening](client.VadOptions.md#controllistening)
- [noiseGateDb](client.VadOptions.md#noisegatedb)
- [signalToNoiseDb](client.VadOptions.md#signaltonoisedb)
- [noiseLearnHalftimeMillis](client.VadOptions.md#noiselearnhalftimemillis)
- [signalSearchFrames](client.VadOptions.md#signalsearchframes)
- [signalActivation](client.VadOptions.md#signalactivation)
- [signalRelease](client.VadOptions.md#signalrelease)
- [signalSustainMillis](client.VadOptions.md#signalsustainmillis)

## Properties

### enabled

• **enabled**: `boolean`

Run signal detection for every full audio frame (by default 30 ms).
Setting this to `false` saves some CPU cycles and [controlListening](client.VadOptions.md#controllistening) won't have an effect.

Default: false.

___

### controlListening

• **controlListening**: `boolean`

Enable VAD to automatically control [BrowserClient.start](../classes/client.BrowserClient.md#start) and [BrowserClient.stop](../classes/client.BrowserClient.md#stop) based on isSignalDetected state.

Default: true.

___

### noiseGateDb

• **noiseGateDb**: `number`

Absolute signal energy threshold.

Range: -90.0f [dB, extremely sensitive] to 0.0f [dB, extemely insensitive]. Default: -24 [dB].

___

### signalToNoiseDb

• **signalToNoiseDb**: `number`

Signal-to-noise energy threshold. Noise energy level is dynamically adjusted to current conditions.

Default: 3.0 [dB].

___

### noiseLearnHalftimeMillis

• **noiseLearnHalftimeMillis**: `number`

Rate of background noise learn. Defined as duration in which background noise energy is adjusted halfway towards current frame's energy.
Noise level is only adjusted when `isSignalDetected` flag is clear.

Range: 0, 5000 [ms]. Default: 400 [ms].

___

### signalSearchFrames

• **signalSearchFrames**: `number`

Number of past audio frames (by default 30 ms) analyzed for determining `isSignalDetected` state. Should be less or equal than [DecoderOptions.historyFrames](client.DecoderOptions.md#historyframes) setting.

Range: 1 to 32 [frames]. Default: 5 [frames].

___

### signalActivation

• **signalActivation**: `number`

`isSignalDetected` will be set if ratio of loud/silent frames in past [signalSearchFrames](client.VadOptions.md#signalsearchframes) exceeds [signalActivation](client.VadOptions.md#signalactivation).

Range: 0.0 to 1.0. Default: 0.7.

___

### signalRelease

• **signalRelease**: `number`

`isSignalDetected` will be cleared if ratio of loud/silent frames in past [signalSearchFrames](client.VadOptions.md#signalsearchframes) goes lower than [signalRelease](client.VadOptions.md#signalrelease) and [signalSustainMillis](client.VadOptions.md#signalsustainmillis) has elapsed.

Range: 0.0 to 1.0. Default: 0.2.

___

### signalSustainMillis

• **signalSustainMillis**: `number`

Minimum duration to hold 'isSignalDetected' set. This effectively defines the minimum length of the utterance sent for speech decoding. Setting this below 2000 ms may degrade speech-to-text accuracy.

Range: 2000 to 8000 [ms]. Default: 3000 [ms].
