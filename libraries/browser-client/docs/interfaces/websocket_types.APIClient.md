[@speechly/browser-client](../README.md) / [websocket/types](../modules/websocket_types.md) / APIClient

# Interface: APIClient

[websocket/types](../modules/websocket_types.md).APIClient

The interface for a client for Speechly SLU WebSocket API.

## Implemented by

- [`WebWorkerController`](../classes/websocket_webWorkerController.WebWorkerController.md)

## Table of contents

### Methods

- [onResponse](websocket_types.APIClient.md#onresponse)
- [onClose](websocket_types.APIClient.md#onclose)
- [initialize](websocket_types.APIClient.md#initialize)
- [setSourceSampleRate](websocket_types.APIClient.md#setsourcesamplerate)
- [close](websocket_types.APIClient.md#close)
- [startContext](websocket_types.APIClient.md#startcontext)
- [stopContext](websocket_types.APIClient.md#stopcontext)
- [switchContext](websocket_types.APIClient.md#switchcontext)
- [sendAudio](websocket_types.APIClient.md#sendaudio)
- [postMessage](websocket_types.APIClient.md#postmessage)

## Methods

### onResponse

▸ **onResponse**(`cb`): `void`

Registers a callback that is invoked whenever a response is received from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`ResponseCallback`](../modules/websocket_types.md#responsecallback) | this callback to invoke. |

#### Returns

`void`

___

### onClose

▸ **onClose**(`cb`): `void`

Registers a callback that is invoked whenever WebSocket connection is closed (either normally or due to an error).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`CloseCallback`](../modules/websocket_types.md#closecallback) | the callback to invoke. |

#### Returns

`void`

___

### initialize

▸ **initialize**(`apiUrl`, `authToken`, `targetSampleRate`, `debug`): `Promise`<`void`\>

Initialises the client.

This method will be called by the Client as part of the initialisation process.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiUrl` | `string` | url. |
| `authToken` | `string` | authentication token. |
| `targetSampleRate` | `number` | target sample rate of audio. |
| `debug` | `boolean` | debug flag. |

#### Returns

`Promise`<`void`\>

___

### setSourceSampleRate

▸ **setSourceSampleRate**(`sourceSampleRate`): `Promise`<`void`\>

Initialises the client.

This should prepare websocket to be used (set source sample rate).
This method will be called by the Client as part of the initialisation process.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceSampleRate` | `number` | sample rate of audio source. |

#### Returns

`Promise`<`void`\>

___

### close

▸ **close**(): `Promise`<`void`\>

Closes the client.

This should close the connection and tear down all infrastructure related to it.
Calling `initialize` again after calling `close` should be possible.

#### Returns

`Promise`<`void`\>

___

### startContext

▸ **startContext**(`appId?`): `Promise`<`string`\>

Starts a new audio context by sending the start event to the API.
The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.

#### Parameters

| Name | Type |
| :------ | :------ |
| `appId?` | `string` |

#### Returns

`Promise`<`string`\>

___

### stopContext

▸ **stopContext**(): `Promise`<`string`\>

Stops an audio context by sending the stop event to the API.
The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.

#### Returns

`Promise`<`string`\>

___

### switchContext

▸ **switchContext**(`appId`): `Promise`<`string`\>

Stops current context and immediately starts a new SLU context
by sending a start context event to the API and unmuting the microphone.

#### Parameters

| Name | Type |
| :------ | :------ |
| `appId` | `string` |

#### Returns

`Promise`<`string`\>

___

### sendAudio

▸ **sendAudio**(`audioChunk`): `void`

Sends audio to the API.
If there is no active context (no successful previous calls to `startContext`), this must fail.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `audioChunk` | `Float32Array` | audio chunk to send. |

#### Returns

`void`

___

### postMessage

▸ **postMessage**(`message`): `void`

Sends message to the Worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Object` | message to send. |

#### Returns

`void`
