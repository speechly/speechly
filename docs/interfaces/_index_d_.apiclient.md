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

▸ **close**(`closeCode`: number, `closeReason`: string): *Error | void*

Defined in index.d.ts:38

Closes the client.

This should close the connection and tear down all infrastructure related to it.
Calling `initialize` again after calling `close` should be possible.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`closeCode` | number | WebSocket close code to send to the API. |
`closeReason` | string | WebSocket close reason to send to the API.  |

**Returns:** *Error | void*

___

###  initialize

▸ **initialize**(`deviceID`: string, `cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:28

Initialises the client.

This should prepare websocket to be used (i.e. establish connection to the API).
This method will be called by the Client as part of the initialisation process.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`deviceID` | string | device ID to use when connecting to the API. |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback to invoke when initialisation is completed (either successfully or with an error).  |

**Returns:** *void*

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

▸ **sendAudio**(`audioChunk`: ArrayBuffer): *Error | void*

Defined in index.d.ts:59

Sends audio to the API.
If there is no active context (no successful previous calls to `startContext`), this must fail.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`audioChunk` | ArrayBuffer | audio chunk to send.  |

**Returns:** *Error | void*

___

###  startContext

▸ **startContext**(`cb`: [ContextCallback](../modules/_index_d_.md#contextcallback)): *void*

Defined in index.d.ts:45

Starts a new audio context by sending the start event to the API.
The callback must be invoked after the API has responded with confirmation or an error has occured.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ContextCallback](../modules/_index_d_.md#contextcallback) | the callback to invoke after the starting has finished.  |

**Returns:** *void*

___

###  stopContext

▸ **stopContext**(`cb`: [ContextCallback](../modules/_index_d_.md#contextcallback)): *void*

Defined in index.d.ts:52

Stops an audio context by sending the stop event to the API.
The callback must be invoked after the API has responded with confirmation or an error has occured.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ContextCallback](../modules/_index_d_.md#contextcallback) | the callback to invoke after the stopping has finished.  |

**Returns:** *void*
