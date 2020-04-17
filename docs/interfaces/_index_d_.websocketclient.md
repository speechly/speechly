[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [WebsocketClient](_index_d_.websocketclient.md)

# Interface: WebsocketClient

The interface for a client for Speechly SLU WebSocket API.

## Hierarchy

* **WebsocketClient**

## Index

### Methods

* [close](_index_d_.websocketclient.md#close)
* [initialize](_index_d_.websocketclient.md#initialize)
* [onClose](_index_d_.websocketclient.md#onclose)
* [onResponse](_index_d_.websocketclient.md#onresponse)
* [sendAudio](_index_d_.websocketclient.md#sendaudio)
* [startContext](_index_d_.websocketclient.md#startcontext)
* [stopContext](_index_d_.websocketclient.md#stopcontext)

## Methods

###  close

▸ **close**(`closeCode`: number, `closeReason`: string): *Error | void*

Defined in index.d.ts:566

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

Defined in index.d.ts:556

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

Defined in index.d.ts:546

Registers a callback that is invoked whenever WebSocket connection is closed (either normally or due to an error).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [CloseCallback](../modules/_index_d_.md#closecallback) | the callback to invoke.  |

**Returns:** *void*

___

###  onResponse

▸ **onResponse**(`cb`: [ResponseCallback](../modules/_index_d_.md#responsecallback)): *void*

Defined in index.d.ts:540

Registers a callback that is invoked whenever a response is received from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ResponseCallback](../modules/_index_d_.md#responsecallback) | this callback to invoke.  |

**Returns:** *void*

___

###  sendAudio

▸ **sendAudio**(`audioChunk`: ArrayBuffer): *Error | void*

Defined in index.d.ts:587

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

Defined in index.d.ts:573

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

Defined in index.d.ts:580

Stops an audio context by sending the stop event to the API.
The callback must be invoked after the API has responded with confirmation or an error has occured.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ContextCallback](../modules/_index_d_.md#contextcallback) | the callback to invoke after the stopping has finished.  |

**Returns:** *void*
