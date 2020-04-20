[@speechly/browser-client](../README.md) › ["index.d"](_index_d_.md)

# External module: "index.d"

## Index

### Enumerations

* [ClientState](../enums/_index_d_.clientstate.md)
* [WebsocketResponseType](../enums/_index_d_.websocketresponsetype.md)

### Classes

* [Client](../classes/_index_d_.client.md)

### Interfaces

* [APIClient](../interfaces/_index_d_.apiclient.md)
* [ClientOptions](../interfaces/_index_d_.clientoptions.md)
* [Entity](../interfaces/_index_d_.entity.md)
* [EntityResponse](../interfaces/_index_d_.entityresponse.md)
* [Intent](../interfaces/_index_d_.intent.md)
* [IntentResponse](../interfaces/_index_d_.intentresponse.md)
* [Microphone](../interfaces/_index_d_.microphone.md)
* [Segment](../interfaces/_index_d_.segment.md)
* [Storage](../interfaces/_index_d_.storage.md)
* [TentativeEntitiesResponse](../interfaces/_index_d_.tentativeentitiesresponse.md)
* [TentativeTranscriptResponse](../interfaces/_index_d_.tentativetranscriptresponse.md)
* [TranscriptResponse](../interfaces/_index_d_.transcriptresponse.md)
* [WebsocketResponse](../interfaces/_index_d_.websocketresponse.md)
* [Word](../interfaces/_index_d_.word.md)

### Type aliases

* [AudioCallback](_index_d_.md#audiocallback)
* [CloseCallback](_index_d_.md#closecallback)
* [ContextCallback](_index_d_.md#contextcallback)
* [EntityCallback](_index_d_.md#entitycallback)
* [ErrorCallback](_index_d_.md#errorcallback)
* [IntentCallback](_index_d_.md#intentcallback)
* [ResponseCallback](_index_d_.md#responsecallback)
* [SegmentChangeCallback](_index_d_.md#segmentchangecallback)
* [StateChangeCallback](_index_d_.md#statechangecallback)
* [StorageGetCallback](_index_d_.md#storagegetcallback)
* [TentativeEntitiesCallback](_index_d_.md#tentativeentitiescallback)
* [TentativeTranscriptCallback](_index_d_.md#tentativetranscriptcallback)
* [TranscriptCallback](_index_d_.md#transcriptcallback)

### Variables

* [DefaultSampleRate](_index_d_.md#const-defaultsamplerate)
* [ErrAlreadyInitialized](_index_d_.md#const-erralreadyinitialized)
* [ErrDeviceNotSupported](_index_d_.md#const-errdevicenotsupported)
* [ErrKeyNotFound](_index_d_.md#const-errkeynotfound)
* [ErrNoAudioConsent](_index_d_.md#const-errnoaudioconsent)
* [ErrNoStorageSupport](_index_d_.md#const-errnostoragesupport)
* [ErrNotInitialized](_index_d_.md#const-errnotinitialized)

### Functions

* [stateToString](_index_d_.md#statetostring)

## Type aliases

###  AudioCallback

Ƭ **AudioCallback**: *function*

Defined in index.d.ts:66

A callback that receives an ArrayBuffer representing a frame of audio.

#### Type declaration:

▸ (`audioBuffer`: ArrayBuffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`audioBuffer` | ArrayBuffer |

___

###  CloseCallback

Ƭ **CloseCallback**: *function*

Defined in index.d.ts:234

A callback that is invoked whenever WebSocket connection is closed.

#### Type declaration:

▸ (`err`: Error): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

___

###  ContextCallback

Ƭ **ContextCallback**: *function*

Defined in index.d.ts:240

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

Defined in index.d.ts:279

A callback that is invoked whenever new entity is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `entity`: [Entity](../interfaces/_index_d_.entity.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`entity` | [Entity](../interfaces/_index_d_.entity.md) |

___

###  ErrorCallback

Ƭ **ErrorCallback**: *function*

Defined in index.d.ts:346

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

Defined in index.d.ts:367

A callback that is invoked whenever new intent (tentative or not) is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `intent`: [Intent](../interfaces/_index_d_.intent.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`intent` | [Intent](../interfaces/_index_d_.intent.md) |

___

###  ResponseCallback

Ƭ **ResponseCallback**: *function*

Defined in index.d.ts:426

A callback that is invoked whenever a response is received from Speechly SLU WebSocket API.

#### Type declaration:

▸ (`response`: [WebsocketResponse](../interfaces/_index_d_.websocketresponse.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`response` | [WebsocketResponse](../interfaces/_index_d_.websocketresponse.md) |

___

###  SegmentChangeCallback

Ƭ **SegmentChangeCallback**: *function*

Defined in index.d.ts:463

A callback that is invoked whenever current {@link Segment | segment} changes.

#### Type declaration:

▸ (`segment`: [Segment](../interfaces/_index_d_.segment.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`segment` | [Segment](../interfaces/_index_d_.segment.md) |

___

###  StateChangeCallback

Ƭ **StateChangeCallback**: *function*

Defined in index.d.ts:469

A callback that is invoked whenever the {@link ClientState | client state} changes.

#### Type declaration:

▸ (`state`: [ClientState](../enums/_index_d_.clientstate.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [ClientState](../enums/_index_d_.clientstate.md) |

___

###  StorageGetCallback

Ƭ **StorageGetCallback**: *function*

Defined in index.d.ts:526

A callback that receives either an error or the value retrieved from the storage.

#### Type declaration:

▸ (`error?`: Error, `val?`: undefined | string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`error?` | Error |
`val?` | undefined &#124; string |

___

###  TentativeEntitiesCallback

Ƭ **TentativeEntitiesCallback**: *function*

Defined in index.d.ts:532

A callback that is invoked whenever new tentative entities are received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `entities`: [Entity](../interfaces/_index_d_.entity.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`entities` | [Entity](../interfaces/_index_d_.entity.md)[] |

___

###  TentativeTranscriptCallback

Ƭ **TentativeTranscriptCallback**: *function*

Defined in index.d.ts:549

A callback that is invoked whenever a new tentative transcript is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `words`: [Word](../interfaces/_index_d_.word.md)[], `text`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`words` | [Word](../interfaces/_index_d_.word.md)[] |
`text` | string |

___

###  TranscriptCallback

Ƭ **TranscriptCallback**: *function*

Defined in index.d.ts:570

A callback that is invoked whenever a new transcript is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `word`: [Word](../interfaces/_index_d_.word.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`word` | [Word](../interfaces/_index_d_.word.md) |

## Variables

### `Const` DefaultSampleRate

• **DefaultSampleRate**: *16000* = 16000

Defined in index.d.ts:246

Default sample rate for microphone streams.

___

### `Const` ErrAlreadyInitialized

• **ErrAlreadyInitialized**: *Error*

Defined in index.d.ts:310

Error to be thrown when the initialize method of a Microphone instance is called more than once.

___

### `Const` ErrDeviceNotSupported

• **ErrDeviceNotSupported**: *Error*

Defined in index.d.ts:316

Error to be thrown when the device does not support the Microphone instance's target audio APIs.

___

### `Const` ErrKeyNotFound

• **ErrKeyNotFound**: *Error*

Defined in index.d.ts:322

Error to be thrown if requested key was not found in the storage.

___

### `Const` ErrNoAudioConsent

• **ErrNoAudioConsent**: *Error*

Defined in index.d.ts:328

Error to be thrown when user did not give consent to the application to record audio.

___

### `Const` ErrNoStorageSupport

• **ErrNoStorageSupport**: *Error*

Defined in index.d.ts:334

Error to be thrown if storage API is not supported by the device.

___

### `Const` ErrNotInitialized

• **ErrNotInitialized**: *Error*

Defined in index.d.ts:340

Error to be thrown when the microphone was accessed before it was initialized.

## Functions

###  stateToString

▸ **stateToString**(`state`: [ClientState](../enums/_index_d_.clientstate.md)): *string*

Defined in index.d.ts:476

Converts client state value to a string, which could be useful for debugging or metrics.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [ClientState](../enums/_index_d_.clientstate.md) | the state of the client |

**Returns:** *string*
