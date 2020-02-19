[@speechly/browser-client](../README.md) › ["speechly.d"](_speechly_d_.md)

# External module: "speechly.d"

## Index

### Enumerations

* [ClientState](../enums/_speechly_d_.clientstate.md)

### Classes

* [Client](../classes/_speechly_d_.client.md)

### Interfaces

* [ClientOptions](../interfaces/_speechly_d_.clientoptions.md)
* [Entity](../interfaces/_speechly_d_.entity.md)
* [Intent](../interfaces/_speechly_d_.intent.md)
* [Segment](../interfaces/_speechly_d_.segment.md)
* [Word](../interfaces/_speechly_d_.word.md)

### Type aliases

* [ContextCallback](_speechly_d_.md#contextcallback)
* [EntityCallback](_speechly_d_.md#entitycallback)
* [ErrorCallback](_speechly_d_.md#errorcallback)
* [IntentCallback](_speechly_d_.md#intentcallback)
* [SegmentChangeCallback](_speechly_d_.md#segmentchangecallback)
* [StateChangeCallback](_speechly_d_.md#statechangecallback)
* [TentativeEntitiesCallback](_speechly_d_.md#tentativeentitiescallback)
* [TentativeTranscriptCallback](_speechly_d_.md#tentativetranscriptcallback)
* [TranscriptCallback](_speechly_d_.md#transcriptcallback)

### Functions

* [stateToString](_speechly_d_.md#statetostring)

## Type aliases

###  ContextCallback

Ƭ **ContextCallback**: *function*

Defined in speechly.d.ts:148

A callback that receives either an error or a contextId.

#### Type declaration:

▸ (`error?`: Error, `contextId?`: undefined | string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error?` | Error |
`contextId?` | undefined &#124; string |

___

###  EntityCallback

Ƭ **EntityCallback**: *function*

Defined in speechly.d.ts:181

A callback that is invoked whenever new entity is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `entity`: [Entity](../interfaces/_speechly_d_.entity.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`entity` | [Entity](../interfaces/_speechly_d_.entity.md) |

___

###  ErrorCallback

Ƭ **ErrorCallback**: *function*

Defined in speechly.d.ts:187

A callback that receives an optional error.

#### Type declaration:

▸ (`error?`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error?` | Error |

___

###  IntentCallback

Ƭ **IntentCallback**: *function*

Defined in speechly.d.ts:208

A callback that is invoked whenever new intent (tentative or not) is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `intent`: [Intent](../interfaces/_speechly_d_.intent.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`intent` | [Intent](../interfaces/_speechly_d_.intent.md) |

___

###  SegmentChangeCallback

Ƭ **SegmentChangeCallback**: *function*

Defined in speechly.d.ts:245

A callback that is invoked whenever current {@link Segment | segment} changes.

#### Type declaration:

▸ (`segment`: [Segment](../interfaces/_speechly_d_.segment.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`segment` | [Segment](../interfaces/_speechly_d_.segment.md) |

___

###  StateChangeCallback

Ƭ **StateChangeCallback**: *function*

Defined in speechly.d.ts:251

A callback that is invoked whenever the {@link ClientState | client state} changes.

#### Type declaration:

▸ (`state`: [ClientState](../enums/_speechly_d_.clientstate.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [ClientState](../enums/_speechly_d_.clientstate.md) |

___

###  TentativeEntitiesCallback

Ƭ **TentativeEntitiesCallback**: *function*

Defined in speechly.d.ts:264

A callback that is invoked whenever new tentative entities are received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `entities`: [Entity](../interfaces/_speechly_d_.entity.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`entities` | [Entity](../interfaces/_speechly_d_.entity.md)[] |

___

###  TentativeTranscriptCallback

Ƭ **TentativeTranscriptCallback**: *function*

Defined in speechly.d.ts:270

A callback that is invoked whenever a new tentative transcript is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `words`: [Word](../interfaces/_speechly_d_.word.md)[], `text`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`words` | [Word](../interfaces/_speechly_d_.word.md)[] |
`text` | string |

___

###  TranscriptCallback

Ƭ **TranscriptCallback**: *function*

Defined in speechly.d.ts:276

A callback that is invoked whenever a new transcript is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `word`: [Word](../interfaces/_speechly_d_.word.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`word` | [Word](../interfaces/_speechly_d_.word.md) |

## Functions

###  stateToString

▸ **stateToString**(`state`: [ClientState](../enums/_speechly_d_.clientstate.md)): *string*

Defined in speechly.d.ts:258

Converts client state value to a string, which could be useful for debugging or metrics.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [ClientState](../enums/_speechly_d_.clientstate.md) | the state of the client |

**Returns:** *string*
