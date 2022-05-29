[@speechly/browser-client](../README.md) / [client](../modules/client.md) / VadOptions

# Interface: VadOptions

[client](../modules/client.md).VadOptions

Options for voice activity detection (VAD)

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

Run signal detection analysis on incoming audio stream:
- Calculate signalDb for current audio frame (pooled from stream)
- Determine if frame is loud enough: signalDb `>` [noiseGateDb](client.VadOptions.md#noisegatedb) `>` (noiseLevelDb + [signalToNoiseDb](client.VadOptions.md#signaltonoisedb))
- Maintain history of loud/silent frames.
- Set or clear isSignalDetected flag based on ratio of loud/silent frames in last [signalSearchFrames](client.VadOptions.md#signalsearchframes).
- Keep isSignalDetected flag set at least for [signalSustainMillis](client.VadOptions.md#signalsustainmillis).

When false, controlListening won't have effect. Default: false.

___

### controlListening

• **controlListening**: `boolean`

Enable VAD to automatically call start/stop based on isSignalDetected state.
Default: true.

___

### noiseGateDb

• **noiseGateDb**: `number`

Absolute signal energy required.
Range: -90.0f to 0.0f [dB]. Default: -24 [dB].

___

### signalToNoiseDb

• **signalToNoiseDb**: `number`

Relative signal-to-noise energy required top of learned background noise level.
Default: 3.0 [dB].

___

### noiseLearnHalftimeMillis

• **noiseLearnHalftimeMillis**: `number`

Rate of background noise learn. Defined as duration in which background noise energy is adjusted halfway towards current frame's energy.
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
