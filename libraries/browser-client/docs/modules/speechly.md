[@speechly/browser-client](../README.md) / speechly

# Module: speechly

## Table of contents

### Variables

- [ErrDeviceNotSupported](speechly.md#errdevicenotsupported)
- [ErrAppIdChangeWithoutProjectLogin](speechly.md#errappidchangewithoutprojectlogin)
- [DefaultSampleRate](speechly.md#defaultsamplerate)

### Interfaces

- [Segment](../interfaces/speechly.Segment.md)
- [Intent](../interfaces/speechly.Intent.md)
- [Word](../interfaces/speechly.Word.md)
- [Entity](../interfaces/speechly.Entity.md)

### Classes

- [SegmentState](../classes/speechly.SegmentState.md)

## Variables

### ErrDeviceNotSupported

• `Const` **ErrDeviceNotSupported**: `Error`

Error to be thrown when the device does not support audioContext.

___

### ErrAppIdChangeWithoutProjectLogin

• `Const` **ErrAppIdChangeWithoutProjectLogin**: `Error`

Error to be thrown when user tries to change appId without project login.

___

### DefaultSampleRate

• `Const` **DefaultSampleRate**: ``16000``

Default sample rate for microphone streams.
