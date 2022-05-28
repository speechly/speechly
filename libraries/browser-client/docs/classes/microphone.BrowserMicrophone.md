[@speechly/browser-client](../README.md) / [microphone](../modules/microphone.md) / BrowserMicrophone

# Class: BrowserMicrophone

[microphone](../modules/microphone.md).BrowserMicrophone

Gets browser based microphone using the window.navigator.mediaDevices interface.
The exposed `mediaStream` can be attached to a `BrowserClient` instance.

## Table of contents

### Constructors

- [constructor](microphone.BrowserMicrophone.md#constructor)

### Methods

- [initialize](microphone.BrowserMicrophone.md#initialize)
- [close](microphone.BrowserMicrophone.md#close)
- [isRecording](microphone.BrowserMicrophone.md#isrecording)

### Properties

- [mediaStream](microphone.BrowserMicrophone.md#mediastream)

## Constructors

### constructor

• **new BrowserMicrophone**()

## Methods

### initialize

▸ **initialize**(): `Promise`<`void`\>

Initializes the microphone. Needs to happen after a user interaction in the view.
The reason for that is that it's required for user to first interact with the page,
before it can capture or play audio and video, for privacy and user experience reasons.

#### Returns

`Promise`<`void`\>

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

## Properties

### mediaStream

• `Optional` **mediaStream**: `MediaStream`
