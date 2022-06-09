[@speechly/browser-client](../README.md) / [microphone](../modules/microphone.md) / BrowserMicrophone

# Class: BrowserMicrophone

[microphone](../modules/microphone.md).BrowserMicrophone

Gets browser based microphone using the window.navigator.mediaDevices interface.
The exposed `mediaStream` can be attached to a `BrowserClient` instance.

## Table of contents

### Constructors

- [constructor](microphone.BrowserMicrophone.md#constructor)

### Properties

- [stateChangeCbs](microphone.BrowserMicrophone.md#statechangecbs)
- [mediaStream](microphone.BrowserMicrophone.md#mediastream)

### Methods

- [onStateChange](microphone.BrowserMicrophone.md#onstatechange)
- [initialize](microphone.BrowserMicrophone.md#initialize)
- [setState](microphone.BrowserMicrophone.md#setstate)
- [close](microphone.BrowserMicrophone.md#close)
- [isRecording](microphone.BrowserMicrophone.md#isrecording)

## Constructors

### constructor

• **new BrowserMicrophone**()

## Properties

### stateChangeCbs

• **stateChangeCbs**: (`state`: [`AudioSourceState`](../enums/microphone.AudioSourceState.md)) => `void`[] = `[]`

___

### mediaStream

• `Optional` **mediaStream**: `MediaStream`

## Methods

### onStateChange

▸ **onStateChange**(`cb`): `void`

Adds a listener for the state changes of the client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`state`: [`AudioSourceState`](../enums/microphone.AudioSourceState.md)) => `void` | the callback to invoke on a client state change. |

#### Returns

`void`

___

### initialize

▸ **initialize**(): `Promise`<`void`\>

Initializes the microphone. Needs to happen after a user interaction in the view.
The reason for that is that it's required for user to first interact with the page,
before it can capture or play audio and video, for privacy and user experience reasons.

#### Returns

`Promise`<`void`\>

___

### setState

▸ **setState**(`newState`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newState` | [`AudioSourceState`](../enums/microphone.AudioSourceState.md) |

#### Returns

`void`

___

### close

▸ **close**(): `Promise`<`void`\>

Closes the microphone, releases all resources and stops the Speechly client.

#### Returns

`Promise`<`void`\>

___

### isRecording

▸ **isRecording**(): `boolean`

#### Returns

`boolean`

true if microphone is open
