[@speechly/react-client](../README.md) / [context](../modules/context.md) / SpeechProviderProps

# Interface: SpeechProviderProps

[context](../modules/context.md).SpeechProviderProps

Props for SpeechContext provider, which are used to initialise API client.

## Hierarchy

- `DecoderOptions`

  ↳ **`SpeechProviderProps`**

## Table of contents

### Properties

- [disableTentative](context.SpeechProviderProps.md#disabletentative)
- [children](context.SpeechProviderProps.md#children)
- [vad](context.SpeechProviderProps.md#vad)
- [connect](context.SpeechProviderProps.md#connect)
- [appId](context.SpeechProviderProps.md#appid)
- [projectId](context.SpeechProviderProps.md#projectid)
- [apiUrl](context.SpeechProviderProps.md#apiurl)
- [sampleRate](context.SpeechProviderProps.md#samplerate)
- [debug](context.SpeechProviderProps.md#debug)
- [logSegments](context.SpeechProviderProps.md#logsegments)
- [callbacks](context.SpeechProviderProps.md#callbacks)
- [decoder](context.SpeechProviderProps.md#decoder)
- [storage](context.SpeechProviderProps.md#storage)
- [frameMillis](context.SpeechProviderProps.md#framemillis)
- [historyFrames](context.SpeechProviderProps.md#historyframes)

## Properties

### disableTentative

• `Optional` **disableTentative**: `boolean`

Whether to disable reacting to tentative items. Set this to true if you don't use them.

___

### children

• `Optional` **children**: `ReactNode`

___

### vad

• `Optional` **vad**: `Partial`<`VadOptions`\>

Enable voice activity detection (VAD) configuration overrides

#### Inherited from

DecoderOptions.vad

___

### connect

• `Optional` **connect**: `boolean`

Connect to Speechly upon creating the client instance. Defaults to true.

#### Inherited from

DecoderOptions.connect

___

### appId

• `Optional` **appId**: `string`

The unique identifier of an app in the dashboard.

#### Inherited from

DecoderOptions.appId

___

### projectId

• `Optional` **projectId**: `string`

The unique identifier of a project in the dashboard.

#### Inherited from

DecoderOptions.projectId

___

### apiUrl

• `Optional` **apiUrl**: `string`

The URL of Speechly SLU API endpoint. Defaults to https://api.speechly.com.

#### Inherited from

DecoderOptions.apiUrl

___

### sampleRate

• `Optional` **sampleRate**: `number`

The sample rate of the audio to use.

#### Inherited from

DecoderOptions.sampleRate

___

### debug

• `Optional` **debug**: `boolean`

Whether to output debug statements to the console.

#### Inherited from

DecoderOptions.debug

___

### logSegments

• `Optional` **logSegments**: `boolean`

Whether to output updated segments to the console.

#### Inherited from

DecoderOptions.logSegments

___

### callbacks

• `Optional` **callbacks**: `EventCallbacks`

Listener for client state changes.

#### Inherited from

DecoderOptions.callbacks

___

### decoder

• `Optional` **decoder**: `CloudDecoder`

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

#### Inherited from

DecoderOptions.decoder

___

### storage

• `Optional` **storage**: `Storage`

Custom storage implementation.
If not provided, browser's LocalStorage API is used.

#### Inherited from

DecoderOptions.storage

___

### frameMillis

• `Optional` **frameMillis**: `number`

Length of audio frame in milliseconds. Audio frame is the audio basic processing unit in VAD and audio history ringbuffer.

#### Inherited from

DecoderOptions.frameMillis

___

### historyFrames

• `Optional` **historyFrames**: `number`

Number of history frames to keep in ringbuffer. They are sent upon start of context to capture the start of utterance, which is especially important to compensate loss of utterance start with VAD.

#### Inherited from

DecoderOptions.historyFrames
