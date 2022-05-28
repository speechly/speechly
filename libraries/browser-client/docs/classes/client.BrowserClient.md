[@speechly/browser-client](../README.md) / [client](../modules/client.md) / BrowserClient

# Class: BrowserClient

[client](../modules/client.md).BrowserClient

Speechly BrowserClient streams audio containing speech for cloud processing and
provides the results of automatic speech recogition (ASR) and natural langugage understanding (NLU) via callbacks.

Usage:

- Create a BrowserClient instance with a valid appId from https://api.speechly.com/dashboard passed with the options.
- Create a [BrowserMicrophone](microphone.BrowserMicrophone.md) instance and [attach](client.BrowserClient.md#attach) the mediaStream to BrowserClient.
- Process the ASR/NLU result [Segment](../interfaces/speechly.Segment.md) in your custom handler passed to the [onSegmentChange](client.BrowserClient.md#onsegmentchange) callback.

## Table of contents

### Constructors

- [constructor](client.BrowserClient.md#constructor)

### Methods

- [initialize](client.BrowserClient.md#initialize)
- [attach](client.BrowserClient.md#attach)
- [isActive](client.BrowserClient.md#isactive)
- [start](client.BrowserClient.md#start)
- [stop](client.BrowserClient.md#stop)
- [setContextOptions](client.BrowserClient.md#setcontextoptions)
- [adjustAudioProcessor](client.BrowserClient.md#adjustaudioprocessor)
- [uploadAudioData](client.BrowserClient.md#uploadaudiodata)
- [startStream](client.BrowserClient.md#startstream)
- [stopStream](client.BrowserClient.md#stopstream)
- [detach](client.BrowserClient.md#detach)
- [close](client.BrowserClient.md#close)
- [onStart](client.BrowserClient.md#onstart)
- [onStop](client.BrowserClient.md#onstop)
- [onSegmentChange](client.BrowserClient.md#onsegmentchange)
- [onTranscript](client.BrowserClient.md#ontranscript)
- [onEntity](client.BrowserClient.md#onentity)
- [onIntent](client.BrowserClient.md#onintent)
- [onTentativeTranscript](client.BrowserClient.md#ontentativetranscript)
- [onTentativeEntities](client.BrowserClient.md#ontentativeentities)
- [onTentativeIntent](client.BrowserClient.md#ontentativeintent)
- [onStateChange](client.BrowserClient.md#onstatechange)

## Constructors

### constructor

• **new BrowserClient**(`customOptions`)

Create a new BrowserClient instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customOptions` | [`DecoderOptions`](../interfaces/client.DecoderOptions.md) | any custom options for BrowserClient and the enclosed CloudDecoder. |

## Methods

### initialize

▸ **initialize**(`options?`): `Promise`<`void`\>

Connect to cloud, create an AudioContext for receiving audio samples from a MediaStream
and initialize a worker for audio processing and bi-directional streaming to the cloud.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.mediaStream?` | `MediaStream` |

#### Returns

`Promise`<`void`\>

___

### attach

▸ **attach**(`mediaStream`): `Promise`<`void`\>

Attach a MediaStream to the client, enabling the client to send the audio to the
Speechly API for processing. The processing is activated by calling
[BrowserClient.start](client.BrowserClient.md#start) and deactivated by calling [BrowserClient.stop](client.BrowserClient.md#stop).

#### Parameters

| Name | Type |
| :------ | :------ |
| `mediaStream` | `MediaStream` |

#### Returns

`Promise`<`void`\>

___

### isActive

▸ **isActive**(): `boolean`

#### Returns

`boolean`

Whether the client is processing audio at the moment.

___

### start

▸ **start**(`options?`): `Promise`<`string`\>

Starts a new audio context, returning it's id to use for matching received responses.
If an active context already exists, an error is thrown.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ContextOptions`](../interfaces/client.ContextOptions.md) | any custom options for the audio processing. |

#### Returns

`Promise`<`string`\>

The contextId of the active audio context

___

### stop

▸ **stop**(`stopDelayMs?`): `Promise`<`void`\>

Stops the current audio context and deactivates the audio processing pipeline.
If there is no active audio context, a warning is logged to console.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stopDelayMs` | `number` |

#### Returns

`Promise`<`void`\>

___

### setContextOptions

▸ **setContextOptions**(`options`): `Promise`<`void`\>

Sets the default context options (appId, inference parameters, timezone). New audio contexts
use these options until new options are provided. Decoder's functions startContext() can
also override the options per function call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ContextOptions`](../interfaces/client.ContextOptions.md) |

#### Returns

`Promise`<`void`\>

___

### adjustAudioProcessor

▸ **adjustAudioProcessor**(`ap`): `void`

Control audio processor parameters like VAD

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ap` | [`AudioProcessorParameters`](../interfaces/client.AudioProcessorParameters.md) | Audio processor parameters to adjust |

#### Returns

`void`

___

### uploadAudioData

▸ **uploadAudioData**(`audioData`, `options?`): `Promise`<[`Segment`](../interfaces/speechly.Segment.md)[]\>

Upload an existing binary audio data buffer to the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audioData` | `ArrayBuffer` | audio data in a binary format. Will be decoded. |
| `options?` | [`ContextOptions`](../interfaces/client.ContextOptions.md) | any custom options for the audio processing. |

#### Returns

`Promise`<[`Segment`](../interfaces/speechly.Segment.md)[]\>

___

### startStream

▸ **startStream**(`streamOptionOverrides?`): `Promise`<`void`\>

`startStream` is used to indicate start of continuous audio stream.
It resets the stream sample counters and history.
BrowserClient internally calls `startStream` upon `initialize` and `start` so it's not needed unless you've manually called `stopStream` and want to resume audio processing afterwards.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `streamOptionOverrides?` | `Partial`<[`StreamOptions`](../interfaces/client.StreamOptions.md)\> | options for stream processing |

#### Returns

`Promise`<`void`\>

___

### stopStream

▸ **stopStream**(): `Promise`<`void`\>

`stopStream` is used to indicate end of continuous audio stream.
It ensures that all of the internal audio buffers are flushed for processing.
BrowserClient internally calls `stopStream` upon `stop` so it's not needed unless then source audio stream is no longer available or you manually want to pause audio processing.
Use `startStream` to resume audio processing afterwards.

#### Returns

`Promise`<`void`\>

___

### detach

▸ **detach**(): `Promise`<`void`\>

Detach or disconnect the client from the audio source.

#### Returns

`Promise`<`void`\>

___

### close

▸ **close**(): `Promise`<`void`\>

Closes the client, detaching from any audio source and disconnecting any audio
processors.

#### Returns

`Promise`<`void`\>

___

### onStart

▸ **onStart**(`cb`): `void`

Adds a listener for start events

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`) => `void` | the callback to invoke on context start |

#### Returns

`void`

___

### onStop

▸ **onStop**(`cb`): `void`

Adds a listener for stop events

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`) => `void` | the callback to invoke on context stop |

#### Returns

`void`

___

### onSegmentChange

▸ **onSegmentChange**(`cb`): `void`

Adds a listener for current segment change events.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`segment`: [`Segment`](../interfaces/speechly.Segment.md)) => `void` | the callback to invoke on segment change events. |

#### Returns

`void`

___

### onTranscript

▸ **onTranscript**(`cb`): `void`

Adds a listener for transcript responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`, `segmentId`: `number`, `word`: [`Word`](../interfaces/speechly.Word.md)) => `void` | the callback to invoke on a transcript response. |

#### Returns

`void`

___

### onEntity

▸ **onEntity**(`cb`): `void`

Adds a listener for entity responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`, `segmentId`: `number`, `entity`: [`Entity`](../interfaces/speechly.Entity.md)) => `void` | the callback to invoke on an entity response. |

#### Returns

`void`

___

### onIntent

▸ **onIntent**(`cb`): `void`

Adds a listener for intent responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`, `segmentId`: `number`, `intent`: [`Intent`](../interfaces/speechly.Intent.md)) => `void` | the callback to invoke on an intent response. |

#### Returns

`void`

___

### onTentativeTranscript

▸ **onTentativeTranscript**(`cb`): `void`

Adds a listener for tentative transcript responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`, `segmentId`: `number`, `words`: [`Word`](../interfaces/speechly.Word.md)[], `text`: `string`) => `void` | the callback to invoke on a tentative transcript response. |

#### Returns

`void`

___

### onTentativeEntities

▸ **onTentativeEntities**(`cb`): `void`

Adds a listener for tentative entities responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`, `segmentId`: `number`, `entities`: [`Entity`](../interfaces/speechly.Entity.md)[]) => `void` | the callback to invoke on a tentative entities response. |

#### Returns

`void`

___

### onTentativeIntent

▸ **onTentativeIntent**(`cb`): `void`

Adds a listener for tentative intent responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`contextId`: `string`, `segmentId`: `number`, `intent`: [`Intent`](../interfaces/speechly.Intent.md)) => `void` | the callback to invoke on a tentative intent response. |

#### Returns

`void`

___

### onStateChange

▸ **onStateChange**(`cb`): `void`

Adds a listener for the state changes of the client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`state`: [`DecoderState`](../enums/client.DecoderState.md)) => `void` | the callback to invoke on a client state change. |

#### Returns

`void`
