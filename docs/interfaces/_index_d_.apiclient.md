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
* [sendAudio](_index_d_.apiclient.md#sendaudio)
* [startContext](_index_d_.apiclient.md#startcontext)
* [stopContext](_index_d_.apiclient.md#stopcontext)

## Methods

###  close

▸ **close**(): *Promise‹void›*

Defined in index.d.ts:40

Closes the client.

This should close the connection and tear down all infrastructure related to it.
Calling `initialize` again after calling `close` should be possible.

**Returns:** *Promise‹void›*

___

###  initialize

▸ **initialize**(`appId`: string, `deviceId`: string, `token?`: undefined | string): *Promise‹string›*

Defined in index.d.ts:33

Initialises the client.

This should prepare websocket to be used (i.e. establish connection to the API).
This method will be called by the Client as part of the initialisation process.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`appId` | string | app ID to use when connecting to the API. |
`deviceId` | string | device ID to use when connecting to the API. |
`token?` | undefined &#124; string | login token in JWT format, which was e.g. cached from previous session.                If the token is not provided or is invalid, a new token will be fetched instead.  |

**Returns:** *Promise‹string›*

- the token that was used to establish connection to the API, so that it can be cached for later.
           If the provided token was used, it will be returned instead.

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

###  sendAudio

▸ **sendAudio**(`audioChunk`: Int16Array): *Error | void*

Defined in index.d.ts:57

Sends audio to the API.
If there is no active context (no successful previous calls to `startContext`), this must fail.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`audioChunk` | Int16Array | audio chunk to send.  |

**Returns:** *Error | void*

___

###  startContext

▸ **startContext**(): *Promise‹string›*

Defined in index.d.ts:45

Starts a new audio context by sending the start event to the API.
The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.

**Returns:** *Promise‹string›*

___

###  stopContext

▸ **stopContext**(): *Promise‹string›*

Defined in index.d.ts:50

Stops an audio context by sending the stop event to the API.
The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.

**Returns:** *Promise‹string›*
