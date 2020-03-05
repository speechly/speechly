[@speechly/browser-client](../README.md) › ["speechly.d"](_speechly_d_.md)

# External module: "speechly.d"

## Index

### Enumerations

* [ClientState](../enums/_speechly_d_.clientstate.md)

### Classes

* [BrowserMicrophone](../classes/_speechly_d_.browsermicrophone.md)
* [Client](../classes/_speechly_d_.client.md)

### Interfaces

* [ClientOptions](../interfaces/_speechly_d_.clientoptions.md)
* [Entity](../interfaces/_speechly_d_.entity.md)
* [Intent](../interfaces/_speechly_d_.intent.md)
* [Microphone](../interfaces/_speechly_d_.microphone.md)
* [Segment](../interfaces/_speechly_d_.segment.md)
* [Word](../interfaces/_speechly_d_.word.md)

### Type aliases

* [AudioCallback](_speechly_d_.md#audiocallback)
* [ContextCallback](_speechly_d_.md#contextcallback)
* [EntityCallback](_speechly_d_.md#entitycallback)
* [ErrorCallback](_speechly_d_.md#errorcallback)
* [IntentCallback](_speechly_d_.md#intentcallback)
* [SegmentChangeCallback](_speechly_d_.md#segmentchangecallback)
* [StateChangeCallback](_speechly_d_.md#statechangecallback)
* [TentativeEntitiesCallback](_speechly_d_.md#tentativeentitiescallback)
* [TentativeTranscriptCallback](_speechly_d_.md#tentativetranscriptcallback)
* [TranscriptCallback](_speechly_d_.md#transcriptcallback)

### Variables

* [DefaultSampleRate](_speechly_d_.md#const-defaultsamplerate)
* [ErrAlreadyInitialized](_speechly_d_.md#const-erralreadyinitialized)
* [ErrDeviceNotSupported](_speechly_d_.md#const-errdevicenotsupported)
* [ErrNoAudioConsent](_speechly_d_.md#const-errnoaudioconsent)
* [ErrNotInitialized](_speechly_d_.md#const-errnotinitialized)

### Functions

* [stateToString](_speechly_d_.md#statetostring)

## Type aliases

###  AudioCallback

Ƭ **AudioCallback**: *function*

Defined in speechly.d.ts:6

A callback that receives an ArrayBuffer representing a frame of audio.

#### Type declaration:

▸ (`audioBuffer`: ArrayBuffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`audioBuffer` | ArrayBuffer |

___

###  ContextCallback

Ƭ **ContextCallback**: *function*

Defined in speechly.d.ts:179

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

Defined in speechly.d.ts:218

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

Defined in speechly.d.ts:248

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

Defined in speechly.d.ts:269

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

Defined in speechly.d.ts:318

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

Defined in speechly.d.ts:324

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

Defined in speechly.d.ts:337

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

Defined in speechly.d.ts:343

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

Defined in speechly.d.ts:349

A callback that is invoked whenever a new transcript is received from the API.

#### Type declaration:

▸ (`contextId`: string, `segmentId`: number, `word`: [Word](../interfaces/_speechly_d_.word.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`word` | [Word](../interfaces/_speechly_d_.word.md) |

## Variables

### `Const` DefaultSampleRate

• **DefaultSampleRate**: *16000* = 16000

Defined in speechly.d.ts:185

Default sample rate for microphone streams.

___

### `Const` ErrAlreadyInitialized

• **ErrAlreadyInitialized**: *Error*

Defined in speechly.d.ts:224

Error to be thrown when the initialize method of a Microphone instance is called more than once.

___

### `Const` ErrDeviceNotSupported

• **ErrDeviceNotSupported**: *Error*

Defined in speechly.d.ts:230

Error to be thrown when the device does not support the Microphone instance's target audio APIs.

___

### `Const` ErrNoAudioConsent

• **ErrNoAudioConsent**: *Error*

Defined in speechly.d.ts:236

Error to be thrown when user did not give consent to the application to record audio.

___

### `Const` ErrNotInitialized

• **ErrNotInitialized**: *Error*

Defined in speechly.d.ts:242

Error to be thrown when the microphone was accessed before it was initialized.

## Functions

###  stateToString

▸ **stateToString**(`state`: [ClientState](../enums/_speechly_d_.clientstate.md)): *string*

Defined in speechly.d.ts:331

Converts client state value to a string, which could be useful for debugging or metrics.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [ClientState](../enums/_speechly_d_.clientstate.md) | the state of the client |

**Returns:** *string*
