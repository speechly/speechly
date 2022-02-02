[@speechly/browser-client](../README.md) / microphone/types

# Module: microphone/types

## Table of contents

### Variables

- [DefaultSampleRate](microphone_types.md#defaultsamplerate)
- [ErrNotInitialized](microphone_types.md#errnotinitialized)
- [ErrAlreadyInitialized](microphone_types.md#erralreadyinitialized)
- [ErrDeviceNotSupported](microphone_types.md#errdevicenotsupported)
- [ErrNoAudioConsent](microphone_types.md#errnoaudioconsent)
- [ErrAppIdChangeWithoutProjectLogin](microphone_types.md#errappidchangewithoutprojectlogin)

### Type aliases

- [AudioCallback](microphone_types.md#audiocallback)

### Interfaces

- [Microphone](../interfaces/microphone_types.Microphone.md)

## Variables

### DefaultSampleRate

• **DefaultSampleRate**: ``16000``

Default sample rate for microphone streams.

___

### ErrNotInitialized

• **ErrNotInitialized**: `Error`

Error to be thrown when the microphone was accessed before it was initialized.

___

### ErrAlreadyInitialized

• **ErrAlreadyInitialized**: `Error`

Error to be thrown when the initialize method of a Microphone instance is called more than once.

___

### ErrDeviceNotSupported

• **ErrDeviceNotSupported**: `Error`

Error to be thrown when the device does not support the Microphone instance's target audio APIs.

___

### ErrNoAudioConsent

• **ErrNoAudioConsent**: `Error`

Error to be thrown when user did not give consent to the application to record audio.

___

### ErrAppIdChangeWithoutProjectLogin

• **ErrAppIdChangeWithoutProjectLogin**: `Error`

Error to be thrown when user tries to change appId without project login.

## Type aliases

### AudioCallback

Ƭ **AudioCallback**: (`audioBuffer`: `Int16Array`) => `void`

#### Type declaration

▸ (`audioBuffer`): `void`

A callback that receives an ArrayBuffer representing a frame of audio.

##### Parameters

| Name | Type |
| :------ | :------ |
| `audioBuffer` | `Int16Array` |

##### Returns

`void`
