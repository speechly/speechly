[@speechly/browser-client](../README.md) / [client](../modules/client.md) / VadOptions

# Interface: VadOptions

[client](../modules/client.md).VadOptions

Options for voice activity detection (VAD)

## Table of contents

### Properties

- [enabled](client.VadOptions.md#enabled)
- [signalToNoiseDb](client.VadOptions.md#signaltonoisedb)
- [noiseGateDb](client.VadOptions.md#noisegatedb)
- [noiseLearnHalftimeMillis](client.VadOptions.md#noiselearnhalftimemillis)
- [signalSearchFrames](client.VadOptions.md#signalsearchframes)
- [signalActivation](client.VadOptions.md#signalactivation)
- [signalRelease](client.VadOptions.md#signalrelease)
- [signalSustainMillis](client.VadOptions.md#signalsustainmillis)
- [controlListening](client.VadOptions.md#controllistening)
- [immediate](client.VadOptions.md#immediate)

## Properties

### enabled

• **enabled**: `boolean`

Run energy analysis

___

### signalToNoiseDb

• **signalToNoiseDb**: `number`

Signal-to-noise energy ratio needed for frame to be 'loud'.
Default: 3.0 [dB].

___

### noiseGateDb

• **noiseGateDb**: `number`

Energy threshold - below this won't trigger activation.
Range: -90.0f to 0.0f [dB]. Default: -24 [dB].

___

### noiseLearnHalftimeMillis

• **noiseLearnHalftimeMillis**: `number`

Rate of background noise learn. Defined as duration in which background noise energy is moved halfway towards current frame's energy.
Range: 0, 5000 [ms]. Default: 400 [ms].

___

### signalSearchFrames

• **signalSearchFrames**: `number`

Number of past frames analyzed for energy threshold VAD. Should be less or equal than HistoryFrames.
Range: 1 to 32 [frames]. Default: 5 [frames].

___

### signalActivation

• **signalActivation**: `number`

Minimum 'signal' to 'silent' frame ratio in history to activate 'IsSignalDetected'
Range: 0.0 to 1.0. Default: 0.7.

___

### signalRelease

• **signalRelease**: `number`

Maximum 'signal' to 'silent' frame ratio in history to inactivate 'IsSignalDetected'. Only evaluated when the sustain period is over.
Range: 0.0 to 1.0. Default: 0.2.

___

### signalSustainMillis

• **signalSustainMillis**: `number`

Duration to keep 'IsSignalDetected' active. Renewed as long as VADActivation is holds true.
Range: 0 to 8000 [ms]. Default: 3000 [ms].

___

### controlListening

• **controlListening**: `boolean`

Enable listening control if you want to use IsSignalDetected to control SLU start / stop.
Default: true.

___

### immediate

• `Optional` **immediate**: `boolean`

Set audio worker
to ‘immediate audio processor’ mode where it can control start/stop context internally at its own pace.
