[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [APIClient](_index_d_.apiclient.md)

# Interface: APIClient

The interface for a client for Speechly SLU WebSocket API.

## Hierarchy

* **APIClient**

## Index

### Methods

* [close](_index_d_.apiclient.md#close)
* [initialize](_index_d_.apiclient.md#initialize)
* [onClose](_index_d_.apiclient.md#onclose)
* [onResponse](_index_d_.apiclient.md#onresponse)
* [postMessage](_index_d_.apiclient.md#postmessage)
* [sendAudio](_index_d_.apiclient.md#sendaudio)
* [startContext](_index_d_.apiclient.md#startcontext)
* [stopContext](_index_d_.apiclient.md#stopcontext)
* [switchContext](_index_d_.apiclient.md#switchcontext)

## Methods

###  close

▸ **close**(): *Promise‹void›*

Defined in index.d.ts:34

Closes the client.

This should close the connection and tear down all infrastructure related to it.
Calling `initialize` again after calling `close` should be possible.

**Returns:** *Promise‹void›*

___

###  initialize

▸ **initialize**(`sourceSampleRate`: number): *Promise‹void›*

Defined in index.d.ts:27

Initialises the client.

This should prepare websocket to be used (set source sample rate).
This method will be called by the Client as part of the initialisation process.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sourceSampleRate` | number | sample rate of audio source.  |

**Returns:** *Promise‹void›*

___

###  onClose

▸ **onClose**(`cb`: [CloseCallback](../modules/_index_d_.md#closecallback)): *void*

Defined in index.d.ts:18

Registers a callback that is invoked whenever WebSocket connection is closed (either normally or due to an error).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [CloseCallback](../modules/_index_d_.md#closecallback) | the callback to invoke.  |

**Returns:** *void*

___

###  onResponse

▸ **onResponse**(`cb`: [ResponseCallback](../modules/_index_d_.md#responsecallback)): *void*

Defined in index.d.ts:12

Registers a callback that is invoked whenever a response is received from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ResponseCallback](../modules/_index_d_.md#responsecallback) | this callback to invoke.  |

**Returns:** *void*

___

###  postMessage

▸ **postMessage**(`message`: Object): *void*

Defined in index.d.ts:62

Sends message to the Worker.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Object | message to send.  |

**Returns:** *void*

___

###  sendAudio

▸ **sendAudio**(`audioChunk`: Float32Array): *void*

Defined in index.d.ts:56

Sends audio to the API.
If there is no active context (no successful previous calls to `startContext`), this must fail.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`audioChunk` | Float32Array | audio chunk to send.  |

**Returns:** *void*

___

###  startContext

▸ **startContext**(`appId?`: undefined | string): *Promise‹string›*

Defined in index.d.ts:39

Starts a new audio context by sending the start event to the API.
The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.

**Parameters:**

Name | Type |
------ | ------ |
`appId?` | undefined &#124; string |

**Returns:** *Promise‹string›*

___

###  stopContext

▸ **stopContext**(): *Promise‹string›*

Defined in index.d.ts:44

Stops an audio context by sending the stop event to the API.
The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.

**Returns:** *Promise‹string›*

___

###  switchContext

▸ **switchContext**(`appId`: string): *Promise‹string›*

Defined in index.d.ts:49

Stops current context and immediately starts a new SLU context
by sending a start context event to the API and unmuting the microphone.

**Parameters:**

Name | Type |
------ | ------ |
`appId` | string |

**Returns:** *Promise‹string›*
