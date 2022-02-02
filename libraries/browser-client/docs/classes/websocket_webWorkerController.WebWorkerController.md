[@speechly/browser-client](../README.md) / [websocket/webWorkerController](../modules/websocket_webWorkerController.md) / WebWorkerController

# Class: WebWorkerController

[websocket/webWorkerController](../modules/websocket_webWorkerController.md).WebWorkerController

## Implements

- [`APIClient`](../interfaces/websocket_types.APIClient.md)

## Table of contents

### Constructors

- [constructor](websocket_webWorkerController.WebWorkerController.md#constructor)

### Methods

- [onResponse](websocket_webWorkerController.WebWorkerController.md#onresponse)
- [onClose](websocket_webWorkerController.WebWorkerController.md#onclose)
- [initialize](websocket_webWorkerController.WebWorkerController.md#initialize)
- [setSourceSampleRate](websocket_webWorkerController.WebWorkerController.md#setsourcesamplerate)
- [close](websocket_webWorkerController.WebWorkerController.md#close)
- [startContext](websocket_webWorkerController.WebWorkerController.md#startcontext)
- [stopContext](websocket_webWorkerController.WebWorkerController.md#stopcontext)
- [switchContext](websocket_webWorkerController.WebWorkerController.md#switchcontext)
- [postMessage](websocket_webWorkerController.WebWorkerController.md#postmessage)
- [sendAudio](websocket_webWorkerController.WebWorkerController.md#sendaudio)

## Constructors

### constructor

• **new WebWorkerController**()

## Methods

### onResponse

▸ **onResponse**(`cb`): `void`

Registers a callback that is invoked whenever a response is received from the API.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`ResponseCallback`](../modules/websocket_types.md#responsecallback) |

#### Returns

`void`

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[onResponse](../interfaces/websocket_types.APIClient.md#onresponse)

___

### onClose

▸ **onClose**(`cb`): `void`

Registers a callback that is invoked whenever WebSocket connection is closed (either normally or due to an error).

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`CloseCallback`](../modules/websocket_types.md#closecallback) |

#### Returns

`void`

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[onClose](../interfaces/websocket_types.APIClient.md#onclose)

___

### initialize

▸ **initialize**(`apiUrl`, `authToken`, `targetSampleRate`, `debug`): `Promise`<`void`\>

Initialises the client.

This method will be called by the Client as part of the initialisation process.

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiUrl` | `string` |
| `authToken` | `string` |
| `targetSampleRate` | `number` |
| `debug` | `boolean` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[initialize](../interfaces/websocket_types.APIClient.md#initialize)

___

### setSourceSampleRate

▸ **setSourceSampleRate**(`sourceSampleRate`): `Promise`<`void`\>

Initialises the client.

This should prepare websocket to be used (set source sample rate).
This method will be called by the Client as part of the initialisation process.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceSampleRate` | `number` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[setSourceSampleRate](../interfaces/websocket_types.APIClient.md#setsourcesamplerate)

___

### close

▸ **close**(): `Promise`<`void`\>

Closes the client.

This should close the connection and tear down all infrastructure related to it.
Calling `initialize` again after calling `close` should be possible.

#### Returns

`Promise`<`void`\>

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[close](../interfaces/websocket_types.APIClient.md#close)

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

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[startContext](../interfaces/websocket_types.APIClient.md#startcontext)

___

### stopContext

▸ **stopContext**(): `Promise`<`string`\>

Stops an audio context by sending the stop event to the API.
The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.

#### Returns

`Promise`<`string`\>

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[stopContext](../interfaces/websocket_types.APIClient.md#stopcontext)

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

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[switchContext](../interfaces/websocket_types.APIClient.md#switchcontext)

___

### postMessage

▸ **postMessage**(`message`): `void`

Sends message to the Worker.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Object` |

#### Returns

`void`

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[postMessage](../interfaces/websocket_types.APIClient.md#postmessage)

___

### sendAudio

▸ **sendAudio**(`audioChunk`): `void`

Sends audio to the API.
If there is no active context (no successful previous calls to `startContext`), this must fail.

#### Parameters

| Name | Type |
| :------ | :------ |
| `audioChunk` | `Float32Array` |

#### Returns

`void`

#### Implementation of

[APIClient](../interfaces/websocket_types.APIClient.md).[sendAudio](../interfaces/websocket_types.APIClient.md#sendaudio)
