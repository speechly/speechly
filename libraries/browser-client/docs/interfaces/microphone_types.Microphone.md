[@speechly/browser-client](../README.md) / [microphone/types](../modules/microphone_types.md) / Microphone

# Interface: Microphone

[microphone/types](../modules/microphone_types.md).Microphone

The interface for a microphone.

## Implemented by

- [`BrowserMicrophone`](../classes/microphone_browser_microphone.BrowserMicrophone.md)

## Table of contents

### Methods

- [initialize](microphone_types.Microphone.md#initialize)
- [close](microphone_types.Microphone.md#close)
- [mute](microphone_types.Microphone.md#mute)
- [unmute](microphone_types.Microphone.md#unmute)
- [printStats](microphone_types.Microphone.md#printstats)

## Methods

### initialize

▸ **initialize**(`audioContext`, `mediaStreamConstraints`): `Promise`<`void`\>

Initialises the microphone.

This should prepare the microphone infrastructure for receiving audio chunks,
but the microphone should remain muted after the call.
This method will be called by the Client as part of client initialisation process.

#### Parameters

| Name | Type |
| :------ | :------ |
| `audioContext` | `AudioContext` |
| `mediaStreamConstraints` | `MediaStreamConstraints` |

#### Returns

`Promise`<`void`\>

___

### close

▸ **close**(): `Promise`<`void`\>

Closes the microphone, tearing down all the infrastructure.

The microphone should stop emitting audio after this is called.
Calling `initialize` again after calling `close` should succeed and make microphone ready to use again.
This method will be called by the Client as part of client closure process.

#### Returns

`Promise`<`void`\>

___

### mute

▸ **mute**(): `void`

Mutes the microphone. If the microphone is muted, the `onAudio` callbacks should not be called.

#### Returns

`void`

___

### unmute

▸ **unmute**(): `void`

Unmutes the microphone.

#### Returns

`void`

___

### printStats

▸ **printStats**(): `void`

Print usage stats to console in debug mode.

#### Returns

`void`
