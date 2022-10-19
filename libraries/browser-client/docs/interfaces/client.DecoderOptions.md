[@speechly/browser-client](../README.md) / [client](../modules/client.md) / DecoderOptions

# Interface: DecoderOptions

[client](../modules/client.md).DecoderOptions

The options which can be used to configure the client.

## Hierarchy

- `Partial`<`ResolvedDecoderOptions`\>

  ↳ **`DecoderOptions`**

## Table of contents

### Properties

- [vad](client.DecoderOptions.md#vad)
- [connect](client.DecoderOptions.md#connect)
- [appId](client.DecoderOptions.md#appid)
- [projectId](client.DecoderOptions.md#projectid)
- [apiUrl](client.DecoderOptions.md#apiurl)
- [sampleRate](client.DecoderOptions.md#samplerate)
- [debug](client.DecoderOptions.md#debug)
- [logSegments](client.DecoderOptions.md#logsegments)
- [callbacks](client.DecoderOptions.md#callbacks)
- [decoder](client.DecoderOptions.md#decoder)
- [storage](client.DecoderOptions.md#storage)
- [frameMillis](client.DecoderOptions.md#framemillis)
- [historyFrames](client.DecoderOptions.md#historyframes)
- [mediaStream](client.DecoderOptions.md#mediastream)
- [microphone](client.DecoderOptions.md#microphone)
- [closeMicrophone](client.DecoderOptions.md#closemicrophone)

## Properties

### vad

• `Optional` **vad**: `Partial`<[`VadOptions`](client.VadOptions.md)\>

Enable voice activity detection (VAD) configuration overrides

___

### connect

• `Optional` **connect**: `boolean`

Connect to Speechly upon creating the client instance. Defaults to true.

#### Inherited from

Partial.connect

___

### appId

• `Optional` **appId**: `string`

The unique identifier of an app in the dashboard.

#### Inherited from

Partial.appId

___

### projectId

• `Optional` **projectId**: `string`

The unique identifier of a project in the dashboard.

#### Inherited from

Partial.projectId

___

### apiUrl

• `Optional` **apiUrl**: `string`

The URL of Speechly SLU API endpoint. Defaults to https://api.speechly.com.

#### Inherited from

Partial.apiUrl

___

### sampleRate

• `Optional` **sampleRate**: `number`

The sample rate of the audio to use.

#### Inherited from

Partial.sampleRate

___

### debug

• `Optional` **debug**: `boolean`

Whether to output debug statements to the console.

#### Inherited from

Partial.debug

___

### logSegments

• `Optional` **logSegments**: `boolean`

Whether to output updated segments to the console.

#### Inherited from

Partial.logSegments

___

### callbacks

• `Optional` **callbacks**: `EventCallbacks`

Listener for client state changes.

#### Inherited from

Partial.callbacks

___

### decoder

• `Optional` **decoder**: `CloudDecoder`

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

#### Inherited from

Partial.decoder

___

### storage

• `Optional` **storage**: `Storage`

Custom storage implementation.
If not provided, browser's LocalStorage API is used.

#### Inherited from

Partial.storage

___

### frameMillis

• `Optional` **frameMillis**: `number`

Length of audio frame in milliseconds. Audio frame is the audio basic processing unit in VAD and audio history ringbuffer.

#### Inherited from

Partial.frameMillis

___

### historyFrames

• `Optional` **historyFrames**: `number`

Number of history frames to keep in ringbuffer. They are sent upon start of context to capture the start of utterance, which is especially important to compensate loss of utterance start with VAD.

#### Inherited from

Partial.historyFrames

___

### mediaStream

• `Optional` **mediaStream**: `MediaStream`

MediaStream instance to be used with BrowserClient. Only mediaStream or microphone can be used at a time.

#### Inherited from

Partial.mediaStream

___

### microphone

• `Optional` **microphone**: [`BrowserMicrophone`](../classes/microphone.BrowserMicrophone.md)

BrowserMicrophone instance to be used with BrowserClient. Only mediaStream or microphone can be used at a time.

#### Inherited from

Partial.microphone

___

### closeMicrophone

• `Optional` **closeMicrophone**: `boolean`

Controls whether or not microphone should be automatically detached and closed on stop and re-attached on start. MediaStreams cannot be automatically detached.

#### Inherited from

Partial.closeMicrophone
