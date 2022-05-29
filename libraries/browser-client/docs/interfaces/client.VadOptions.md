[@speechly/browser-client](../README.md) / [client](../modules/client.md) / VadOptions

# Interface: VadOptions

[client](../modules/client.md).VadOptions

Options for audio processor's voice activity detection (VAD) system.
Enabling VAD allows hands-free use and eliminates silence from being sent to cloud for speech decoding.

VAD activates when signal energy exceeds a certain level for a period of time.
There is both an absolute energy threshold and dynamic signal-to-noise threshold to adjust.

When [enabled](client.VadOptions.md#enabled) is set, VAD's internal `signalDb`, `noiseLevelDb` and `isSignalDetected` states are updated.
With [controlListening](client.VadOptions.md#controllistening) also set, `isSignalDetected` flag controls start and stop of cloud speech decoding.

Implementation details:
- `signalDb` is calculated for the current full audio frame (default: 30 ms).
- `loud` flag for the current frame is set if signalDb `>` [noiseGateDb](client.VadOptions.md#noisegatedb) `>` (noiseLevelDb + [signalToNoiseDb](client.VadOptions.md#signaltonoisedb)).
- History of past loud/silent frame flags is updated.
- `isSignalDetected` is set if ratio of loud/silent frames in past [signalSearchFrames](client.VadOptions.md#signalsearchframes) exceeds [signalActivation](client.VadOptions.md#signalactivation).
- `isSignalDetected` is cleared if ratio of loud/silent frames in past [signalSearchFrames](client.VadOptions.md#signalsearchframes) goes lower than [signalRelease](client.VadOptions.md#signalrelease) and [signalSustainMillis](client.VadOptions.md#signalsustainmillis) has passed.
- Speech detection is started/stopped whenever `isSignalDetected` changes state when [controlListening](client.VadOptions.md#controllistening) is set.
- Background noise level is adjusted whenever `isSignalDetected` flag is clear.

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

Run signal detection analysis on incoming audio stream.
When false, [controlListening](client.VadOptions.md#controllistening) won't have effect.

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
Range: -90.0f to 0.0f [dB]. Default: -24 [dB].

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

Number of past frames analyzed for setting `isSignalDetected` flag. Should be less or equal than [DecoderOptions.historyFrames](client.DecoderOptions.md#historyframes) setting.
Range: 1 to 32 [frames]. Default: 5 [frames].

___

### signalActivation

• **signalActivation**: `number`

Minimum 'loud' to 'silent' frame ratio in history to set 'isSignalDetected' flag.
Range: 0.0 to 1.0. Default: 0.7.

___

### signalRelease

• **signalRelease**: `number`

Maximum 'loud' to 'silent' frame ratio in history to clear 'isSignalDetected' flag. Only evaluated when the sustain period is over.
Range: 0.0 to 1.0. Default: 0.2.

___

### signalSustainMillis

• **signalSustainMillis**: `number`

Minimum duration to keep 'isSignalDetected' flag in set state. This effectively sets the minimum length of the utterance. Setting this to a value below 2000 ms may degrade speech-to-text accuracy.
Range: 2000 to 8000 [ms]. Default: 3000 [ms].
