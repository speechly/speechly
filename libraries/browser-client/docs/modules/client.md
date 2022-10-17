[@speechly/browser-client](../README.md) / client

# Module: client

## Table of contents

### Functions

- [stateToString](client.md#statetostring)

### Classes

- [BrowserClient](../classes/client.BrowserClient.md)

### Interfaces

- [DecoderOptions](../interfaces/client.DecoderOptions.md)
- [VadOptions](../interfaces/client.VadOptions.md)
- [AudioProcessorParameters](../interfaces/client.AudioProcessorParameters.md)
- [StreamOptions](../interfaces/client.StreamOptions.md)
- [ContextOptions](../interfaces/client.ContextOptions.md)

### Variables

- [DecoderDefaultOptions](client.md#decoderdefaultoptions)
- [VadDefaultOptions](client.md#vaddefaultoptions)
- [StreamDefaultOptions](client.md#streamdefaultoptions)
- [ErrAlreadyStarted](client.md#erralreadystarted)
- [ErrAlreadyStopped](client.md#erralreadystopped)

### Enumerations

- [DecoderState](../enums/client.DecoderState.md)

## Functions

### stateToString

▸ **stateToString**(`state`): `string`

Converts client state value to a string, which could be useful for debugging or metrics.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`DecoderState`](../enums/client.DecoderState.md) | the state of the client |

#### Returns

`string`

## Variables

### DecoderDefaultOptions

• `Const` **DecoderDefaultOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `connect` | `boolean` |
| `apiUrl` | `string` |
| `sampleRate` | `number` |
| `debug` | `boolean` |
| `logSegments` | `boolean` |
| `frameMillis` | `number` |
| `historyFrames` | `number` |

___

### VadDefaultOptions

• `Const` **VadDefaultOptions**: [`VadOptions`](../interfaces/client.VadOptions.md)

Default options for voice activity detection (VAD)

___

### StreamDefaultOptions

• `Const` **StreamDefaultOptions**: [`StreamOptions`](../interfaces/client.StreamOptions.md)

___

### ErrAlreadyStarted

• `Const` **ErrAlreadyStarted**: `Error`

Error to be thrown when BrowserClient is already started

___

### ErrAlreadyStopped

• `Const` **ErrAlreadyStopped**: `Error`

Error to be thrown when BrowserClient is already stopped
