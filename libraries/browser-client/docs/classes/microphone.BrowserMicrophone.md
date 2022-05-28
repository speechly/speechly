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

Initializes the microphone. Must to be called directly in an user interaction handler
to successfully enable audio capturing. The call will trigger a browser permission prompt on the first time.

This behaviour is imposed by browser security features.

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
