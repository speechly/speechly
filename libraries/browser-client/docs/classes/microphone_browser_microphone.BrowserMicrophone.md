[@speechly/browser-client](../README.md) / [microphone/browser\_microphone](../modules/microphone_browser_microphone.md) / BrowserMicrophone

# Class: BrowserMicrophone

[microphone/browser_microphone](../modules/microphone_browser_microphone.md).BrowserMicrophone

## Implements

- [`Microphone`](../interfaces/microphone_types.Microphone.md)

## Table of contents

### Constructors

- [constructor](microphone_browser_microphone.BrowserMicrophone.md#constructor)

### Methods

- [initialize](microphone_browser_microphone.BrowserMicrophone.md#initialize)
- [close](microphone_browser_microphone.BrowserMicrophone.md#close)
- [mute](microphone_browser_microphone.BrowserMicrophone.md#mute)
- [unmute](microphone_browser_microphone.BrowserMicrophone.md#unmute)
- [printStats](microphone_browser_microphone.BrowserMicrophone.md#printstats)

## Constructors

### constructor

• **new BrowserMicrophone**(`isWebkit`, `sampleRate`, `apiClient`, `debug?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isWebkit` | `boolean` | `undefined` |
| `sampleRate` | `number` | `undefined` |
| `apiClient` | [`APIClient`](../interfaces/websocket_types.APIClient.md) | `undefined` |
| `debug` | `boolean` | `false` |

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

#### Implementation of

[Microphone](../interfaces/microphone_types.Microphone.md).[initialize](../interfaces/microphone_types.Microphone.md#initialize)

___

### close

▸ **close**(): `Promise`<`void`\>

Closes the microphone, tearing down all the infrastructure.

The microphone should stop emitting audio after this is called.
Calling `initialize` again after calling `close` should succeed and make microphone ready to use again.
This method will be called by the Client as part of client closure process.

#### Returns

`Promise`<`void`\>

#### Implementation of

[Microphone](../interfaces/microphone_types.Microphone.md).[close](../interfaces/microphone_types.Microphone.md#close)

___

### mute

▸ **mute**(): `void`

Mutes the microphone. If the microphone is muted, the `onAudio` callbacks should not be called.

#### Returns

`void`

#### Implementation of

[Microphone](../interfaces/microphone_types.Microphone.md).[mute](../interfaces/microphone_types.Microphone.md#mute)

___

### unmute

▸ **unmute**(): `void`

Unmutes the microphone.

#### Returns

`void`

#### Implementation of

[Microphone](../interfaces/microphone_types.Microphone.md).[unmute](../interfaces/microphone_types.Microphone.md#unmute)

___

### printStats

▸ **printStats**(): `void`

print statistics to console

#### Returns

`void`

#### Implementation of

[Microphone](../interfaces/microphone_types.Microphone.md).[printStats](../interfaces/microphone_types.Microphone.md#printstats)
