[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [Client](_index_d_.client.md)

# Class: Client

A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the microphone
and websocket connection to Speechly API, passing control events and audio stream to the API, reading the responses
and dispatching them, as well as providing a high-level API for interacting with so-called speech segments.

## Hierarchy

* **Client**

## Index

### Constructors

* [constructor](_index_d_.client.md#constructor)

### Methods

* [close](_index_d_.client.md#close)
* [initialize](_index_d_.client.md#initialize)
* [onEntity](_index_d_.client.md#onentity)
* [onIntent](_index_d_.client.md#onintent)
* [onSegmentChange](_index_d_.client.md#onsegmentchange)
* [onStateChange](_index_d_.client.md#onstatechange)
* [onTentativeEntities](_index_d_.client.md#ontentativeentities)
* [onTentativeIntent](_index_d_.client.md#ontentativeintent)
* [onTentativeTranscript](_index_d_.client.md#ontentativetranscript)
* [onTranscript](_index_d_.client.md#ontranscript)
* [startContext](_index_d_.client.md#startcontext)
* [stopContext](_index_d_.client.md#stopcontext)

## Constructors

###  constructor

\+ **new Client**(`options`: [ClientOptions](../interfaces/_index_d_.clientoptions.md)): *[Client](_index_d_.client.md)*

Defined in index.d.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ClientOptions](../interfaces/_index_d_.clientoptions.md) |

**Returns:** *[Client](_index_d_.client.md)*

## Methods

###  close

▸ **close**(`cb?`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:49

Closes the client by closing the API connection and disabling the microphone.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback which is invoked when closure is complete.  |

**Returns:** *void*

___

###  initialize

▸ **initialize**(`cb?`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:44

Initializes the client, by initializing the microphone and establishing connection to the API.

This function HAS to be invoked by a user by e.g. binding it to a button press,
or some other user-performed action.

If this function is invoked without a user interaction,
the microphone functionality will not work due to security restrictions by the browser.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback which is invoked when the initialization is complete.  |

**Returns:** *void*

___

###  onEntity

▸ **onEntity**(`cb`: [EntityCallback](../modules/_index_d_.md#entitycallback)): *void*

Defined in index.d.ts:89

Adds a listener for entity responses from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [EntityCallback](../modules/_index_d_.md#entitycallback) | the callback to invoke on an entity response.  |

**Returns:** *void*

___

###  onIntent

▸ **onIntent**(`cb`: [IntentCallback](../modules/_index_d_.md#intentcallback)): *void*

Defined in index.d.ts:99

Adds a listener for intent responses from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [IntentCallback](../modules/_index_d_.md#intentcallback) | the callback to invoke on an intent response.  |

**Returns:** *void*

___

###  onSegmentChange

▸ **onSegmentChange**(`cb`: [SegmentChangeCallback](../modules/_index_d_.md#segmentchangecallback)): *void*

Defined in index.d.ts:69

Adds a listener for current segment change events.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [SegmentChangeCallback](../modules/_index_d_.md#segmentchangecallback) | the callback to invoke on segment change events.  |

**Returns:** *void*

___

###  onStateChange

▸ **onStateChange**(`cb`: [StateChangeCallback](../modules/_index_d_.md#statechangecallback)): *void*

Defined in index.d.ts:64

Adds a listener for client state change events.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [StateChangeCallback](../modules/_index_d_.md#statechangecallback) | the callback to invoke on state change events.  |

**Returns:** *void*

___

###  onTentativeEntities

▸ **onTentativeEntities**(`cb`: [TentativeEntitiesCallback](../modules/_index_d_.md#tentativeentitiescallback)): *void*

Defined in index.d.ts:84

Adds a listener for tentative entities responses from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [TentativeEntitiesCallback](../modules/_index_d_.md#tentativeentitiescallback) | the callback to invoke on a tentative entities response.  |

**Returns:** *void*

___

###  onTentativeIntent

▸ **onTentativeIntent**(`cb`: [IntentCallback](../modules/_index_d_.md#intentcallback)): *void*

Defined in index.d.ts:94

Adds a listener for tentative intent responses from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [IntentCallback](../modules/_index_d_.md#intentcallback) | the callback to invoke on a tentative intent response.  |

**Returns:** *void*

___

###  onTentativeTranscript

▸ **onTentativeTranscript**(`cb`: [TentativeTranscriptCallback](../modules/_index_d_.md#tentativetranscriptcallback)): *void*

Defined in index.d.ts:74

Adds a listener for tentative transcript responses from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [TentativeTranscriptCallback](../modules/_index_d_.md#tentativetranscriptcallback) | the callback to invoke on a tentative transcript response.  |

**Returns:** *void*

___

###  onTranscript

▸ **onTranscript**(`cb`: [TranscriptCallback](../modules/_index_d_.md#transcriptcallback)): *void*

Defined in index.d.ts:79

Adds a listener for transcript responses from the API.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [TranscriptCallback](../modules/_index_d_.md#transcriptcallback) | the callback to invoke on a transcript response.  |

**Returns:** *void*

___

###  startContext

▸ **startContext**(`cb?`: [ContextCallback](../modules/_index_d_.md#contextcallback)): *void*

Defined in index.d.ts:54

Starts a new SLU context by sending a start context event to the API and unmuting the microphone.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [ContextCallback](../modules/_index_d_.md#contextcallback) | the callback which is invoked when the context start was acknowledged by the API.  |

**Returns:** *void*

___

###  stopContext

▸ **stopContext**(`cb?`: [ContextCallback](../modules/_index_d_.md#contextcallback)): *void*

Defined in index.d.ts:59

Stops current SLU context by sending a stop context event to the API and muting the microphone.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [ContextCallback](../modules/_index_d_.md#contextcallback) | the callback which is invoked when the context stop was acknowledged by the API.  |

**Returns:** *void*
